import React, { useContext, useEffect } from "react";
import styles from "./styles.module.sass";
import { observer } from "mobx-react-lite";
import { Context } from "../../app";
import { IChat } from "../../model/chat";
import { ApiService } from "../../api/api.service";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { store } = useContext(Context);
  const [chats, setChats] = React.useState<IChat[]>([]);
  const [modal, setModal] = React.useState(false);

  const [id, setId] = React.useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function getChats() {
      const res = await ApiService.getChats();
      setChats(res);
    }

    getChats();
  }, [store.lastUpdate]);

  const createChat = async () => {
    await ApiService.createChat(id);
    setModal(false);
  };

  return (
    <div className={styles.Sidebar}>
      <div
        id="modal"
        className={`${styles.Modal} ${modal && styles.Open}`}
        onClick={(e: any) => {
          if (e.target.id === "modal") {
            setModal(false);
          }
        }}
      >
        <div className={styles.Content}>
          <input
            value={id}
            onChange={(e) => setId(parseInt(e.target.value))}
            className={styles.Input}
            type="number"
            placeholder="Enter id"
          />
          <button className={styles.Button} onClick={createChat}>
            Create chat
          </button>
        </div>
        <div className={styles.Background} />
      </div>
      <button className={styles.Search} onClick={() => setModal(true)}>
        Find a new partner
      </button>

      <div className={styles.Partners}>
        {chats.length > 0
          ? chats.map((chat: IChat) => (
              <div
                className={styles.Partner}
                key={chat.id}
                onClick={() => {
                  navigate(`/app/${chat.id}`);
                }}
              >
                <div className={styles.Avatar} />
                <div className={styles.Info}>
                  <div className={styles.Name}>
                    {chat.partner.id === store.user?.id
                      ? chat.user.nickname
                      : chat.partner.nickname}
                  </div>
                  <div className={styles.LastMessage}>
                    {chat.lastMessage?.text}
                  </div>
                </div>
              </div>
            ))
          : "No chats"}
      </div>

      <div className={styles.Profile}>
        <div className={styles.Avatar} />
        <div className={styles.Name}>
          {store.user?.nickname || store.user?.email || "Anonymous"}
        </div>
      </div>
    </div>
  );
}

export default observer(Sidebar);
