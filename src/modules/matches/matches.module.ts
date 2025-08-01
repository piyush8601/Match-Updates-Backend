import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchesGateway } from './matches.gateway';
import { Match, MatchSchema } from './schemas/match.schema';
import { Commentary, CommentarySchema } from './schemas/commentary.schema';
import { CounterModule } from '../counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Commentary.name, schema: CommentarySchema },
    ]),
    CounterModule
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesGateway],
  exports: [MatchesService, MatchesGateway],
})
export class MatchesModule { }
