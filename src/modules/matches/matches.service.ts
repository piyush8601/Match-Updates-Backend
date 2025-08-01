import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Commentary } from './schemas/commentary.schema';
import { CreateMatchDto } from './dto/create-match.dto';
import { AddCommentaryDto } from './dto/add-commentary.dto';
import { CounterService } from '../counter/counter.service';
import { RedisService } from '../../redis/redis.service';
import { MatchStatus, EventType } from '../../types/match.types';

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Match.name) private readonly matchModel: Model<Match>,
        @InjectModel(Commentary.name) private readonly commentaryModel: Model<Commentary>,
        private readonly counterService: CounterService,
        private readonly redisService: RedisService,
    ) { }

    async startMatch(createMatchDto: CreateMatchDto): Promise<Match> {
        const matchId = await this.counterService.getNextMatchId();

        const match = new this.matchModel({
            ...createMatchDto,
            matchId,
            status: MatchStatus.ONGOING,
            startTime: new Date(),
        });

        const savedMatch = await match.save();

        // Cache match in Redis
        await this.redisService.setObject(`match:${matchId}`, savedMatch, 3600);

        return savedMatch;
    }

    async getMatch(matchId: string): Promise<Match> {
        // Try to get from cache first
        let match = await this.redisService.getObject<Match>(`match:${matchId}`);
        if (match) {
            // Hydrate plain object to Mongoose document
            match = this.matchModel.hydrate(match);
            // Populate commentary after hydration
            match = await match.populate('commentary');
        } else {
            // If not in cache, get from database
            match = await this.matchModel
                .findById( matchId )
                .populate('commentary')
                .exec();

            if (!match) {
                throw new NotFoundException(`Match with ID ${matchId} not found`);
            }

            // Cache for future requests
            await this.redisService.setObject(`match:${matchId}`, match, 3600);
        }

        return match;
    }

    async getAllMatches(): Promise<Match[]> {
        return await this.matchModel
            .find()
            .select('-commentary')
            .sort({ createdAt: -1 })
            .exec();
    }

    async addCommentary(matchId: string, commentaryDto: AddCommentaryDto): Promise<Commentary> {
        const match = await this.getMatch(matchId);

        if (match.status !== MatchStatus.ONGOING) {
            throw new BadRequestException('Cannot add commentary to a match that is not ongoing');
        }

        // Validate ball number
        if (commentaryDto.ball > 6) {
            throw new BadRequestException('Ball number cannot be greater than 6');
        }

        const commentary = new this.commentaryModel({
            ...commentaryDto,
            timestamp: new Date(),
        });

        const savedCommentary: Commentary = await commentary.save();

        // Update match with commentary reference
        match.commentary.push(savedCommentary.id);

        // Update match scores and stats
        await this.updateMatchStats(match, commentaryDto);

        // Update match in database
        await match.save();

        // Update cached match
        await this.redisService.setObject(`match:${matchId}`, match, 3600);

        // Cache latest 10 commentary entries
        await this.cacheLatestCommentary(matchId, savedCommentary);

        return savedCommentary;
    }

    private async updateMatchStats(match: Match, commentary: AddCommentaryDto): Promise<void> {
        // Update current over and ball
        match.currentOver = commentary.over;
        match.currentBall = commentary.ball;

        // Update scores based on batting team
        if (match.battingTeam === 'teamA') {
            match.teamAScore += commentary.runs;
            if (commentary.isWicket) {
                match.teamAWickets += 1;
            }
        } else {
            match.teamBScore += commentary.runs;
            if (commentary.isWicket) {
                match.teamBWickets += 1;
            }
        }

        // Check if over is complete
        if (commentary.ball === 6 && !this.isExtraDelivery(commentary.eventType)) {
            // Switch batting team after each over (simplified logic)
            match.battingTeam = match.battingTeam === 'teamA' ? 'teamB' : 'teamA';
        }

        // Check if match should end
        if (this.shouldEndMatch(match)) {
            match.status = MatchStatus.COMPLETED;
            match.endTime = new Date();
        }
    }

    private isExtraDelivery(eventType: EventType): boolean {
        return eventType === EventType.WIDE || eventType === EventType.NO_BALL;
    }

    private shouldEndMatch(match: Match): boolean {
        // Simplified logic - match ends if all overs are completed or all wickets are down
        const isAllOversComplete = match.currentOver >= match.overs;
        const isAllOut = (match.battingTeam === 'teamA' && match.teamAWickets >= 10) ||
            (match.battingTeam === 'teamB' && match.teamBWickets >= 10);

        return isAllOversComplete || isAllOut;
    }

    private async cacheLatestCommentary(matchId: string, commentary: Commentary): Promise<void> {
        const key = `commentary:${matchId}`;
        const commentaryData = JSON.stringify(commentary);

        await this.redisService.lpush(key, commentaryData);
        await this.redisService.ltrim(key, 0, 9); // Keep only latest 10
    }

    async getLatestCommentary(matchId: string): Promise<Commentary[]> {
        const key = `commentary:${matchId}`;
        const commentaryStrings = await this.redisService.lrange(key, 0, 9);

        return commentaryStrings.map(str => JSON.parse(str));
    }

    async pauseMatch(matchId: string): Promise<Match> {
        const match = await this.getMatch(matchId);

        if (match.status !== MatchStatus.ONGOING) {
            throw new BadRequestException('Can only pause an ongoing match');
        }

        match.status = MatchStatus.PAUSED;
        await match.save();

        // Update cache
        await this.redisService.setObject(`match:${matchId}`, match, 3600);

        return match;
    }

    async resumeMatch(matchId: string): Promise<Match> {
        const match = await this.getMatch(matchId);

        if (match.status !== MatchStatus.PAUSED) {
            throw new BadRequestException('Can only resume a paused match');
        }

        match.status = MatchStatus.ONGOING;
        await match.save();

        // Update cache
        await this.redisService.setObject(`match:${matchId}`, match, 3600);

        return match;
    }
}