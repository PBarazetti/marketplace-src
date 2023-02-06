import { CacheModule as BaseCacheModule, CACHE_MANAGER, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheService } from './cache.service';

@Module({
    imports: [
        BaseCacheModule.registerAsync({
            imports: [ConfigModule],  
            useFactory: (configService: ConfigService) => ({
                store: redisStore, 
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                ttl: 300, //for local testing, 5min of cache TTL
            }),
            inject: [ConfigService],
        })
    ],
    providers: [RedisCacheService],
    exports: [
        BaseCacheModule,
        RedisCacheService
    ]
})
export class RedisCacheModule implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}
    public onModuleInit():any {
        const logger = new Logger('Cache');
    }
}
