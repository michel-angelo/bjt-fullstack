import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const SOCKET_URL = "https://bjt-fullstack-production.up.railway.app";

const socket = io(SOCKET_URL);

function GlobalChat({ user }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [listChat, setListChat] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("riwayat_pesan", (history) => {
      setListChat(history);
      setTimeout(() => chatEndRef.current?.scrollIntoView(), 100);
    });

    socket.on("terima_pesan", (data) => {
      setListChat((prev) => [...prev, data]);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("riwayat_pesan");
      socket.off("terima_pesan");
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const dataMessage = {
      username: user.name || "Anonim",
      text: message,
      photo: user.photo,
      waktu: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    await socket.emit("kirim_pesan", dataMessage);
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">
      {/* KOTAK CHAT */}
      <div
        className={`bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 transform origin-bottom-right mb-4 ${
          open ? "scale-100 opacity-100" : "scale-0 opacity-0 h-0"
        }`}
      >
        {/* Header Chat */}
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold">💬 Tembok Ratapan</h3>
          <button
            onClick={() => setOpen(false)}
            className="text-white hover:text-indigo-200"
          >
            ✖
          </button>
        </div>

        {/* Isi Chat */}
        <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
          {listChat.length === 0 && (
            <p className="text-center text-slate-400 text-xs mt-10">
              Belum ada yang bacot. Mulailah...
            </p>
          )}

          {listChat.map((chat, index) => (
            <div
              key={index}
              className={`flex gap-2 ${
                chat.username === user.name ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={
                  chat.photo ||
                  `https://ui-avatars.com/api/?name=${chat.username}`
                }
                className="w-8 h-8 rounded-full border border-slate-200"
              />
              <div
                className={`max-w-[75%] p-2 rounded-lg text-sm ${
                  chat.username === user.name
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                }`}
              >
                <p
                  className={`font-bold text-[10px] mb-1 ${
                    chat.username === user.name
                      ? "text-indigo-200"
                      : "text-indigo-600"
                  }`}
                >
                  {chat.username}
                </p>
                <p>{chat.text}</p>
                <p
                  className={`text-[9px] text-right mt-1 ${
                    chat.username === user.name
                      ? "text-indigo-300"
                      : "text-slate-400"
                  }`}
                >
                  {chat.waktu}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Chat */}
        <form
          onSubmit={sendMessage}
          className="p-3 bg-white border-t border-slate-100 flex gap-2"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tumpahkan keluh kesah..."
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 transition"
          >
            ➤
          </button>
        </form>
      </div>

      {/* TOMBOL BUKA CHAT (Floating Button) */}
      <button
        onClick={() => setOpen(!open)}
        className={`${
          open ? "hidden" : "flex"
        } w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition items-center justify-center text-2xl animate-bounce`}
      >
        💬
      </button>
    </div>
  );
}

export default GlobalChat;
