import {  Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

@Module({
    imports: [
      TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            autoLoadEntities: true,
            synchronize: true,
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            retryAttempts: 20,
            retryDelay: 5000,
        }),
      }),
    ],
  })
  export class DatabaseModule {}
