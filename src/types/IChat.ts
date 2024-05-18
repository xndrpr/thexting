import { IMessage } from "./IMessage"
import { IUser } from "./IUser"

export interface IChat {
  id: number
  user: IUser
  partner: IUser
  messages: IMessage[]
  lastMessage: IMessage
}