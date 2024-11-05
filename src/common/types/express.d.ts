import { IJwtPayload } from '../../schemas/IJwtPayload';

declare module 'express' {
  export interface Request {
    user?: IJwtPayload;
  }
}
