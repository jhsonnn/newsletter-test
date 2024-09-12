"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitEmail = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage("이메일 구독이 성공적으로 완료되었습니다.");
        setEmail("");
      } else {
        const errorData = await response.json();
        setErrorMessage(
          `구독 요청에 실패했습니다: ${errorData.error || "서버 오류"}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`에러가 발생했습니다: ${error.message}`);
      } else {
        setErrorMessage("알 수 없는 에러가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <input
        id="email"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrorMessage("");
        }}
        placeholder="구독하실 이메일을 입력하세요."
      />
      <button onClick={handleSubmitEmail}>Submit</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
}
