import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, _id: true })
export class Commentary extends Document {
  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ default: 0 })
  runs: number;

  @Prop()
  description: string;

  @Prop({ default : false})
  isSix: boolean;

  @Prop({ default : false})
  isFour: boolean;

  @Prop({ default: false })
  isWicket: boolean;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const CommentarySchema = SchemaFactory.createForClass(Commentary);