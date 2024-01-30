export interface IUser {
  id?: number;
  username?: string;
  email: string;
  password?: string;
}

export interface ILoginResponse {
  access_token: string;
}
