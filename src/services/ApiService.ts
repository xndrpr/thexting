import axios from "axios";
import { $api } from "../utils/$api";
import { IChat } from "../types/IChat";

export class ApiService {
  static async refreshToken() {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {
        withCredentials: true,
      }
    );

    if (res.data) {
      localStorage.setItem("token", res.data);
    }
  }

  static async signIn(data: { email: string; password: string }) {
    const res = await $api.post("/auth/sign-in", data);

    if (res.data) {
      localStorage.setItem("token", res.data);
    }

    return res;
  }

  static async signSocketIn(socket: string) {
    return await $api.post("/auth/sign-socket-in", { socket });
  }

  static async signSocketOut(socket: string) {
    return await $api.post("/auth/sign-socket-out", { socket });
  }

  static async signUp(data: {
    email: string;
    password: string;
    nickname: string;
    dateOfBirth: string;
  }) {
    const res = await $api.post("/auth/sign-up", data);

    if (res.data) {
      localStorage.setItem("token", res.data);
    }

    return res;
  }

  static async signOut() {
    return await $api.post("/auth/sign-out");
  }

  static async getSession() {
    return await $api.get("/auth/session");
  }

  static async getChats(): Promise<IChat[]> {
    return (await $api.get("/chats")).data;
  }

  static async getChat(id: string): Promise<IChat> {
    return (await $api.get(`/chats/${id}`)).data;
  }

  static async createChat(id: number): Promise<IChat> {
    return (await $api.post("/chats/create", { partner: id })).data;
  }

  static async sendMessage(chat: number, text: string, reply: number | null) {
    if (!text) return;
    if (text.length > 1000) return;
    if (!reply) {
      return await $api.post("/messages/create", { chat, text });
    } else {
      return await $api.post("/messages/create", { chat, text, reply });
    }
  }
}
