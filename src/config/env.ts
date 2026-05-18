import dotenv from 'dotenv';
dotenv.config();

const getEnvVar = (key: string, required = true): string => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`متغير البيئة مفقود: ${key}`);
  }
  return value ?? '';
};

export const envConfig = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3000', 10),

  MONGODB_URI: getEnvVar('MONGODB_URI'),

  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: getEnvVar('JWT_ACCESS_EXPIRES_IN'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN'),

  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),

  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:3000',

  get isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  },

  get isProduction(): boolean {
    return this.NODE_ENV === 'production';
  },

  get isTest(): boolean {
    return this.NODE_ENV === 'test';
  },
} as const;