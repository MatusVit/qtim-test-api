import * as bcrypt from 'bcrypt';

export const compareData = async (data: string, hashData: string) => {
  return await bcrypt.compare(data, hashData);
};

export const getHash = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, +process.env.CRYPT_SALT);
};
