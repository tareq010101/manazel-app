import bcrypt from 'bcryptjs';
import { envConfig } from '../../config/env';;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, envConfig.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};