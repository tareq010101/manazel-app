import { Server as SocketServer, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@shared/constants/events';
import { ChatService } from './chat.service';
import { verifyAccessToken } from '@shared/utils/token';

const chatService = new ChatService();

export const registerChatGateway = (io: SocketServer): void => {
  io.on(SOCKET_EVENTS.CONNECTION, async (socket: Socket) => {
    try {
      const token = socket.handshake.auth.token as string;
      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = verifyAccessToken(token);
      const userId = payload.userId;

      socket.data.userId = userId;
      socket.join(userId); // ← عشان الـ notifications توصله real-time
      console.log(`👤 ${userId} متصل عبر Socket`);

      socket.on(SOCKET_EVENTS.JOIN_ROOM, (chatId: string) => {
        socket.join(chatId);
        console.log(`👤 ${userId} دخل المحادثة: ${chatId}`);
      });

      socket.on(SOCKET_EVENTS.LEAVE_ROOM, (chatId: string) => {
        socket.leave(chatId);
        console.log(`👤 ${userId} خرج من المحادثة: ${chatId}`);
      });

      socket.on(
        SOCKET_EVENTS.SEND_MESSAGE,
        async (data: { chatId: string; content: string }) => {
          try {
            const message = await chatService.sendMessage(
              data.chatId,
              userId,
              data.content
            );

            io.to(data.chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
          } catch (error) {
            socket.emit('error', { message: 'فشل إرسال الرسالة' });
          }
        }
      );

      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log(`❌ ${userId} انقطع الاتصال`);
      });
    } catch {
      socket.disconnect();
    }
  });
};