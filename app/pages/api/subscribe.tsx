import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }

    // URL이 undefined일 경우 기본값 설정 또는 에러 처리
    const stibeeApiUrl = process.env.STIBEE_API_URL || "";
    if (!stibeeApiUrl) {
      return res.status(500).json({ error: "STIBEE_API_URL is not defined" });
    }

    try {
      const response = await fetch(stibeeApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: process.env.STIBEE_API_URL || "",
        },
        body: JSON.stringify({
          listID: process.env.STIBEE_LIST_ID || "",
          subscribers: [{ email }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
      } else {
        const errorData = await response.json();
        console.error("subscription failed: ", errorData);
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe! " });
    }
  }
}
