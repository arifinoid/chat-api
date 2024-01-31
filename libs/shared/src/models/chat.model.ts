import { IUser } from './user.model';

export interface IChat {
  id?: number;
  text: string;
  user: IUser;
  created_at: Date;
  updated_at: Date;
}
