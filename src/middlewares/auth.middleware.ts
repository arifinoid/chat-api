import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { IUser } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

export interface RequestModel extends Request {
  user: IUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModel, _: Response, next: NextFunction) {
    try {
      const tokenArr: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArr[1]);
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
