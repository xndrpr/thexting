import { makeAutoObservable } from "mobx";
import { IUser } from "../model/user";
import { IChat } from "../model/chat";

export default class Store {
  auth: boolean = false;
  user: IUser | null = null;
  lastUpdate: Date = new Date();
  selectedChat: IChat | null = null;

  setAuth(value: boolean) {
    this.auth = value;
  }

  setUser(value: IUser | null) {
    this.user = value;
  }

  setSelectedChat(value: IChat | null) {
    this.selectedChat = value;
  }

  update() {
    this.lastUpdate = new Date();
  }

  constructor() {
    makeAutoObservable(this);
  }
}
