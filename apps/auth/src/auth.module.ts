import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import {
  Chat,
  SharedModule,
  SharedService,
  User,
  UserRepository,
  JoinedRoom,
  ConnectedUser,
  Room,
  Auth,
  DbModule,
} from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: 60 * 60 * 10 },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Auth,
      User,
      Chat,
      JoinedRoom,
      ConnectedUser,
      Room,
    ]),
    DbModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtGuard,
    JwtStrategy,
    AuthService,
    { provide: 'AuthServiceInterface', useClass: AuthService },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}