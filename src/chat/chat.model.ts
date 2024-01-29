import { IUser } from 'src/user/user.model';

export interface IRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: IUser[];
  created_at?: Date;
  updated_at?: Date;
}

export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}

export interface IJoinedRoom {
  id?: number;
  socketId: string;
  user: IUser;
  room: IRoom;
}

export interface IChat {
  id?: number;
  text: string;
  user: IUser;
  room: IRoom;
  created_at: Date;
  updated_at: Date;
}
