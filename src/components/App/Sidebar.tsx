import React, { useContext, useEffect } from "react";
import m from "./Sidebar.module.sass";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { IChat } from "../../types/IChat";
import { ApiService } from "../../services/ApiService";
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
  }

  return (
    <div className={m.Sidebar}>
      <div
        id="modal"
        className={`${m.Modal} ${modal && m.Open}`}
        onClick={(e: any) => {
          if (e.target.id === "modal") {
            setModal(false);
          }
        }}
      >
        <div className={m.Content}>
          <input value={id} onChange={(e) => setId(parseInt(e.target.value))} className={m.Input} type="number" placeholder="Enter id" />
          <button className={m.Button} onClick={createChat}>Create chat</button>
        </div>
        <div className={m.Background} />
      </div>
      <button className={m.Search} onClick={() => setModal(true)}>
        Find a new partner
      </button>

      <div className={m.Partners}>
        {chats.length > 0
          ? chats.map((chat: IChat) => (
              <div
                className={m.Partner}
                key={chat.id}
                onClick={() => {
                  navigate(`/app/${chat.id}`);
                }}
              >
                <div className={m.Avatar} />
                <div className={m.Info}>
                  <div className={m.Name}>{chat.partner.id === store.user?.id ? chat.user.nickname : chat.partner.nickname}</div>
                  <div className={m.LastMessage}>{chat.lastMessage?.text}</div>
                </div>
              </div>
            ))
          : "No chats"}
      </div>

      <div className={m.Profile}>
        <div className={m.Avatar} />
        <div className={m.Name}>{store.user?.nickname || store.user?.email || "Anonymous"}</div>
      </div>
    </div>
  );
}

export default observer(Sidebar);
