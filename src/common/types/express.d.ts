import { IJwtPayload } from 'src/schemas/IJwtPayload';

declare module 'express' {
  export interface Request {
    user?: IJwtPayload;
  }
}
