import { NextResponse } from "next/server";

const rateLimitMap = new Map(); // IP 주소 별 요청 카운트를 저장할 Map
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const MAX_REQUESTS = 5; // 1분에 최대 5회 요청 허용

function checkRateLimit(ip: string) {
  const currentTime = Date.now();
  const requestLog = rateLimitMap.get(ip) || [];
  const filteredLog = requestLog.filter(
    (time: number) => currentTime - time < RATE_LIMIT_WINDOW
  );

  rateLimitMap.set(ip, [...filteredLog, currentTime]);
  return filteredLog.length < MAX_REQUESTS;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("remote-addr") ||
    "unknown";

  // Rate limit 검사
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 나중에 다시 시도해주세요." },
      { status: 429 }
    );
  }

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
