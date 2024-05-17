export interface CreateMessageDto {
  socket: string;
  chat: number;
  text: string;
  reply?: number;
}
