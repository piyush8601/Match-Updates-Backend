import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventType } from '../../../types/match.types';

@Schema({ timestamps: true, _id: true })
export class Commentary extends Document {
  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ required: true, enum: EventType })
  eventType: EventType;

  @Prop({ default: 0 })
  runs: number;

  @Prop()
  description: string;

  @Prop()
  batsman: string;

  @Prop()
  bowler: string;

  @Prop({ default: false })
  isWicket: boolean;

  @Prop()
  wicketType: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const CommentarySchema = SchemaFactory.createForClass(Commentary);