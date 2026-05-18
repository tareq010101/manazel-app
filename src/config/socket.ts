import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { envConfig } from './env';
import { registerChatGateway } from '@modules/chat/chat.gateway';

let io: SocketServer;

export const initSocket = (httpServer: HTTPServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: envConfig.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  registerChatGateway(io);

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket.IO لم يتم تهيئته بعد');
  return io;
};