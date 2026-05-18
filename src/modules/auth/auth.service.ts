import { UserModel } from '@modules/user/user.model';
import { IUser } from '@modules/user/user.interface';
import { ApiError } from '@shared/errors/ApiError';
import { hashPassword, comparePassword } from '@shared/utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@shared/utils/token';
import { RegisterDTO, LoginDTO } from './auth.dto';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: Partial<IUser>;
  tokens: AuthTokens;
}

export class AuthService {
  private generateTokens(userId: string, role: IUser['role']): AuthTokens {
    const payload = { userId, role };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

private sanitizeUser(user: IUser): Partial<IUser> {
  const userObj = user.toObject() as Partial<IUser> & {
    password?: string;
    refreshToken?: string;
  };
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
}
  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await UserModel.findOne({ email: dto.email });
    if (existingUser) {
      throw ApiError.conflict('الإيميل ده مسجل بالفعل');
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = await UserModel.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(user._id.toString(), user.role);

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await UserModel.findOne({ email: dto.email }).select(
      '+password +refreshToken'
    );

    if (!user) {
      throw ApiError.unauthorized('الإيميل أو الباسورد غلط');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('الحساب موقوف');
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('الإيميل أو الباسورد غلط');
    }

    const tokens = this.generateTokens(user._id.toString(), user.role);

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(token);

    const user = await UserModel.findById(payload.userId).select(
      '+refreshToken'
    );

    if (!user || user.refreshToken !== token) {
      throw ApiError.unauthorized('الـ refresh token غير صالح');
    }

    const tokens = this.generateTokens(user._id.toString(), user.role);

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }
}