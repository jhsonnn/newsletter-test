import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "이메일을 입력해주세요!" },
      { status: 400 }
    );
  }

  const stibeeApiUrl = process.env.STIBEE_BASE_URL || "";
  const listId = process.env.STIBEE_LIST_ID || "";
  const apiKey = process.env.STIBEE_API_KEY || "";

  if (!stibeeApiUrl || !listId || !apiKey) {
    return NextResponse.json(
      { error: "필수 환경 변수가 설정되지 않았습니다!" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${stibeeApiUrl}/lists/${listId}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: apiKey,
        },
        body: JSON.stringify({
          subscribers: [{ email }],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        message: "구독이 성공적으로 완료되었습니다!",
        data,
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `구독 요청에 실패했습니다: ${errorData.message}` },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "구독 요청 중 오류가 발생했습니다!" },
      { status: 500 }
    );
  }
}
