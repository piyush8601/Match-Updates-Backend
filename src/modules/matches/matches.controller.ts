import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { AddCommentaryDto } from './dto/add-commentary.dto';
import { MatchesGateway } from './matches.gateway';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly matchesGateway: MatchesGateway, // Inject MatchesGateway
  ) {}

  @Post('start')
  async startMatch(@Body() createMatchDto: CreateMatchDto) {
    const match = await this.matchesService.startMatch(createMatchDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Match started successfully',
      data: match,
    };
  }

  @Get()
  async getAllMatches() {
    const matches = await this.matchesService.getAllMatches();
    return {
      statusCode: HttpStatus.OK,
      message: 'Matches retrieved successfully',
      data: matches,
    };
  }

  @Get(':id')
  async getMatch(@Param('id') id: string) {
    const match = await this.matchesService.getMatch(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Match retrieved successfully',
      data: match,
    };
  }

  @Post(':id/commentary')
  async addCommentary(
    @Param('id') id: string,
    @Body() addCommentaryDto: AddCommentaryDto,
  ) {
    const commentary = await this.matchesService.addCommentary(id, addCommentaryDto);
    const match = await this.matchesService.getMatch(id);
    await this.matchesGateway.broadcastCommentaryUpdate(id, commentary, match);
    await this.matchesGateway.broadcastMatchUpdate(id, match);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Commentary added successfully',
      data: commentary,
    };
  }

  @Get(':id/commentary/latest')
  async getLatestCommentary(@Param('id') id: string) {
    const commentary = await this.matchesService.getLatestCommentary(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Latest commentary retrieved successfully',
      data: commentary,
    };
  }

  @Post(':id/pause')
  async pauseMatch(@Param('id') id: string) {
    const match = await this.matchesService.pauseMatch(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Match paused successfully',
      data: match,
    };
  }

  @Post(':id/resume')
  async resumeMatch(@Param('id') id: string) {
    const match = await this.matchesService.resumeMatch(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Match resumed successfully',
      data: match,
    };
  }
}
