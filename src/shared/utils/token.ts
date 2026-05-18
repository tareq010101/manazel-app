import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { envConfig } from '../../config/env';
import { Role } from '../constants/roles';

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: Role;
}

const signToken = (
  payload: TokenPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return signToken(
    payload,
    envConfig.JWT_ACCESS_SECRET,
    envConfig.JWT_ACCESS_EXPIRES_IN
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return signToken(
    payload,
    envConfig.JWT_REFRESH_SECRET,
    envConfig.JWT_REFRESH_EXPIRES_IN
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, envConfig.JWT_REFRESH_SECRET) as TokenPayload;
};