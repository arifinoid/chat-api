import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const getEnv = (key: string) => configService.get(key);
        return {
          type: 'postgres',
          url: `postgres://${getEnv('POSTGRES_USER')}:${getEnv('POSTGRES_PASSWORD')}@${getEnv('POSTGRES_HOST')}:${getEnv('POSTGRES_PORT')}/${getEnv('POSTGRES_DB')}`,
          autoLoadEntities: true,
          synchronize: true,
        };
      },

      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
