import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.sass";
import Sidebar from "../../components/sidebar";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { ApiService } from "../../api/api.service";
import { IMessage } from "../../types/IMessage";
import { SocketContext } from "../../utils/$socket";
import { useParams } from "react-router-dom";
import { formatRelative } from "date-fns";
import { enCA as lcl } from "date-fns/locale";

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

                      <svg
                        className={styles.Hover}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        onClick={() => {
                          console.log("reply", message);
                        }}
                      >
                        <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className={styles.Active}
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
                      </svg>
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
                  {message.length > 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                      />
                    </svg>
                  )}
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
