import { ITokens } from '../../schemas/ITokens';

export class Tokens implements ITokens {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<Tokens>) {
    Object.assign(this, partial);
  }
}
