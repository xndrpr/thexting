import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { SocketsStoreService } from 'src/sockets-store/sockets-store.service';

@Module({
  providers: [MessagesGateway, SocketsStoreService]
})
export class GatewayModule {}
