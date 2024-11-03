export interface IUser {
  userId?: number;
  login?: string;
  name?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string;
}
