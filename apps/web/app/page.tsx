"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <input
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        type="text"
        placeholder="send message"
        name=""
        id=""
      />
      <button
        onClick={() => {
          sendMessage(message);
        }}
      >
        Send
      </button>
      <div>
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </div>
    </div>
  );
}
