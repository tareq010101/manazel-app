import { UserModel } from './user.model';
import { IUser } from './user.interface';
import { ApiError } from '@shared/errors/ApiError';
import { UpdateUserDTO } from './user.dto';

export class UserService {
  async getById(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw ApiError.notFound('المستخدم مش موجود');
    }

    return user;
  }

  async updateById(userId: string, dto: UpdateUserDTO): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('المستخدم مش موجود');
    }

    return user;
  }

  async deactivate(userId: string): Promise<void> {
    const user = await UserModel.findByIdAndUpdate(userId, {
      isActive: false,
    });

    if (!user) {
      throw ApiError.notFound('المستخدم مش موجود');
    }
  }
}