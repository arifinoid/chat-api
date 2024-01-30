import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheService } from '../services/cache.service';

@Module({
  imports: [
    CacheModule.registerAsync<RedisOptions>({
      isGlobal: true,
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const getEnv = (key: string) => configService.get(key);
        return {
          store: redisStore,
          host: getEnv('REDIS_HOST'),
          port: getEnv('REDIS_PORT'),
          password: getEnv('REDIS_PASSWORD'),
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisModule {}
