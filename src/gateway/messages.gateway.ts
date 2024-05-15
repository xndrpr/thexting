import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000', 'http://localhost:6100'] },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  @OnEvent('message.created')
  handleMessage(msg: any, sockets: string[], chatId: number) {
    sockets.forEach((socket) => {
      this.server.to(socket).emit('onMessage', msg, chatId);
    });
  }
}
