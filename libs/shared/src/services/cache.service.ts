import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: unknown, ttl = 0) {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async reset() {
    await this.cache.reset();
  }
}
