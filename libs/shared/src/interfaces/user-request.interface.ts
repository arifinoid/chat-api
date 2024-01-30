import { Request } from 'express';
import { IUser } from '../models/user.model';

export interface UserRequest extends Request {
  user?: {
    id: IUser['id'];
    email: IUser['email'];
    username: IUser['username'];
  };
}
