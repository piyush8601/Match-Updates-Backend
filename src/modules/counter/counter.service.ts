import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './schemas/counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private readonly counterModel: Model<Counter>,
  ) {}

  async getNextMatchId(): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'match_id' },
      { $inc: { value: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Format as 4-digit string (0001, 0002, etc.)
    return counter.value.toString().padStart(4, '0');
  }
}