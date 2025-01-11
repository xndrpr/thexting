import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.sass";
import Sidebar from "../../widgets/sidebar";
import { observer } from "mobx-react-lite";
import { Context } from "../../app";
import { ApiService } from "../../api/api.service";
import { IMessage } from "../../model/message";
import { SocketContext } from "../../shared/$socket";
import { useParams } from "react-router-dom";
import { formatRelative } from "date-fns";
import { enCA as lcl } from "date-fns/locale";
import ReplyIcon from "@assets/icons/reply.svg?react";
import ReplyActiveIcon from "@assets/icons/reply-active.svg?react";
import SendIcon from "@assets/icons/send.svg?react";
import SendActiveIcon from "@assets/icons/send-active.svg?react";

function Chat() {
  const { store } = useContext(Context);
  const $socket = useContext(SocketContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Set<IMessage>>(new Set());
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  const { chatId } = useParams();
  const chatEnd = useRef<any>(null);
  const input = useRef<any>(null);

  useEffect(() => {
    async function getChat() {
      if (chatId) {
        const chat = await ApiService.getChat(chatId);

        store.setSelectedChat(chat);
      }
    }

    getChat();
  }, [chatId, store]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const session = await ApiService.getSession();

        if (session) {
          store.setAuth(true);
          store.setUser({
            email: session.data.data.email,
            nickname: session.data.data.nickname,
            id: session.data.data.id,
          });
        } else {
          store.setAuth(false);
        }
        setLoading(false);
      } catch (e: any) {
        store.setAuth(false);
        setLoading(false);
      }
    };
    checkAuth();
  }, [store]);

  useEffect(() => {
    async function getMessages() {
      setMessages(new Set(store.selectedChat?.messages) || new Set());
    }

    getMessages();
  }, [store.selectedChat]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  useEffect(() => {
    $socket.on("connect", async () => {
      if (!$socket.id) return;

      console.log("WS connected: ", $socket.id);
      await ApiService.signSocketIn($socket.id);
    });
    $socket.on("onMessage", (message: IMessage, chatId: number) => {
      if (store.selectedChat?.id !== chatId) return;

      setMessages((msgs) => new Set([...msgs, message]));
      store.update();
    });
    $socket.on("onChat", (chat: any) => {
      store.update();
    });

    return () => {
      $socket.off("connect");
    };
  }, [$socket, store]);

  const formatRelativeLocale: any = {
    yesterday: "'Yesterday at 'HH:mm:ss",
    today: "'Today at 'HH:mm:ss",
    other: "dd.MM.yyyy 'at 'HH:mm:ss",
  };

  const locale = {
    ...lcl,
    formatRelative: (token: any) => formatRelativeLocale[token],
  };
  const sendMessage = async () => {
    if (message.trim() === "" || !store.user) return;

    setMessage("");

    ApiService.sendMessage(
      store.selectedChat!.id,
      message,
      replyMessage?.id || null
    );
    setReplyMessage(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const createdToString = (message: IMessage) => {
    try {
      return formatRelative(
        new Date(message.createdAt) || new Date(),
        new Date(),
        {
          locale,
        }
      );
    } catch (err) {
      console.log(err);

      return formatRelative(new Date(), new Date(), {
        locale,
      });
    }
  };

  return (
    <div>
      {store.auth ? (
        <div className={styles.App}>
          <Sidebar />
          {store.selectedChat && (
            <div className={styles.Chat}>
              <div className={styles.Profile}>
                <div className={styles.Avatar} />
                <div className={styles.Name}>
                  {store.selectedChat?.partner.id === store.user?.id
                    ? store.selectedChat?.user.nickname
                    : store.selectedChat?.partner.nickname}
                </div>
              </div>

              <div className={styles.Messages}>
                {[...messages]?.map((message) => (
                  <div
                    className={`${styles.Message} ${
                      message.user.id === store.user?.id ? styles.Me : ""
                    }`}
                    onClick={() => {
                      setReplyMessage(message);
                      if (!input) return;

                      input.current.focus();
                    }}
                  >
                    <div
                      className={`${styles.Avatar} ${
                        message.reply?.text ? styles.Has : ""
                      }`}
                    />
                    <div className={styles.Content}>
                      <div
                        className={`${styles.Reply} ${
                          message.reply?.text ? styles.Has : ""
                        }`}
                      >
                        {message.reply?.text || ""}
                      </div>
                      <div className={styles.Top}>
                        <div className={styles.Name}>
                          {message.user.id === store.user?.id
                            ? "You"
                            : message.user.nickname}
                        </div>
                        <div className={styles.Time}>
                          {createdToString(message)}
                        </div>
                      </div>
                      <div className={styles.Text}>{message.text}</div>

                      <div className={styles.Hover}>
                        <ReplyIcon />
                      </div>
                      <div className={styles.Active}>
                        <ReplyActiveIcon />
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>

              <div className={styles.Input}>
                <div
                  className={styles.ReplyTo}
                  onClick={() => setReplyMessage(null)}
                >
                  <p>{replyMessage?.text}</p>
                </div>
                <textarea
                  ref={input}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={
                    message.split("\n").length > 4
                      ? 4
                      : message.split("\n").length
                  }
                  placeholder={`Message ${store.selectedChat?.partner.nickname}...`}
                />
                <button onClick={sendMessage}>
                  {message.length > 0 ? <SendActiveIcon /> : <SendIcon />}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : loading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className={styles.Auth}>
          <p>No Auth</p>
          <a href="/sign-in">
            <button>Sign in</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default observer(Chat);
