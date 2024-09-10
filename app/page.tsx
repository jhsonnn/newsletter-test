"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const handleSubmitEmail = () => {
    setEmail("");
  };

  return (
    <div>
      <input
        id="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="구독하실 이메일을 입력하세요."
      ></input>
      <button onClick={handleSubmitEmail}>Submit</button>
    </div>
  );
}
