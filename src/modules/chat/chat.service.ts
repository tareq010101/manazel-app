import { ChatModel, IChat } from './chat.model';
import { MessageModel, IMessage } from './message.model';
import { ApiError } from '@shared/errors/ApiError';
import { ContractModel } from '@modules/contract/contract.model';

export class ChatService {
  async getOrCreateChat(userId: string): Promise<IChat> {
    const contract = await ContractModel.findOne({
      $or: [{ landlord: userId }, { tenant: userId }],
      status: 'active',
    });

    if (!contract) {
      throw ApiError.notFound('مفيش عقد إيجار فعال');
    }

    let chat = await ChatModel.findOne({ contract: contract._id });

    if (!chat) {
      chat = await ChatModel.create({
        participants: [contract.landlord, contract.tenant],
        contract: contract._id,
      });
    }

    return chat.populate('participants', 'name email');
  }

  async getMessages(
    chatId: string,
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ messages: IMessage[]; total: number; pages: number }> {
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      throw ApiError.notFound('المحادثة مش موجودة');
    }

    const skip = (page - 1) * limit;
    const total = await MessageModel.countDocuments({ chat: chatId });

    const messages = await MessageModel.find({ chat: chatId })
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    await MessageModel.updateMany(
      { chat: chatId, sender: { $ne: userId }, isRead: false },
      { isRead: true }
    );

    return {
      messages: messages.reverse(),
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async sendMessage(
    chatId: string,
    senderId: string,
    content: string
  ): Promise<IMessage> {
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: senderId,
    });

    if (!chat) {
      throw ApiError.notFound('المحادثة مش موجودة');
    }

    const message = await MessageModel.create({
      chat: chatId,
      sender: senderId,
      content,
    });

    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    return message.populate('sender', 'name');
  }

  async getUnreadCount(userId: string): Promise<number> {
    const chats = await ChatModel.find({ participants: userId });
    const chatIds = chats.map((c) => c._id);

    const count = await MessageModel.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: userId },
      isRead: false,
    });

    return count;
  }
}