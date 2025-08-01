import { Module } from '@nestjs/common';
import { MatchesModule } from './modules/matches/matches.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from './config/config.module';
import { MongodbModule } from './config/mongodb.module';
import { CounterModule } from './modules/counter/counter.module';

@Module({
  imports: [
    ConfigModule,
    MongodbModule,
    RedisModule,
    MatchesModule, 
    CounterModule
  ],
  controllers: [],
  providers: [ConfigModule],
})
export class AppModule {}
