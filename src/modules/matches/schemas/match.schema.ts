import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchStatus, Team } from '../../../types/match.types';
import { Commentary } from './commentary.schema';

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop({ required: true, unique: true })
  matchId: string;

  @Prop({ type: Object, required: true })
  teamA: Team;

  @Prop({ type: Object, required: true })
  teamB: Team;

  @Prop({ required: true })
  overs: number;

  @Prop({ default: MatchStatus.NOT_STARTED, enum: MatchStatus })
  status: MatchStatus;

  @Prop({ default: 0 })
  currentOver: number;

  @Prop({ default: 0 })
  currentBall: number;

  @Prop({ default: 'teamA' })
  battingTeam: 'teamA' | 'teamB';

  @Prop({ default: 0 })
  teamAScore: number;

  @Prop({ default: 0 })
  teamAWickets: number;

  @Prop({ default: 0 })
  teamBScore: number;

  @Prop({ default: 0 })
  teamBWickets: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Commentary' }] })
  commentary: Commentary[];

  @Prop()
  venue: string;

  @Prop({ default: Date.now })
  startTime: Date;

  @Prop()
  endTime: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);