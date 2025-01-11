import { IUser } from "./user";

export interface IMessage {
  id: number;
  user: IUser;
  text: string;
  reply?: IMessage;
  createdAt: string;
}
