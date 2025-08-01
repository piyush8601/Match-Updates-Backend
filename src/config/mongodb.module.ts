import { Module, Global } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoUri, // from custom config.service
        dbName: configService.mongoDbName,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
