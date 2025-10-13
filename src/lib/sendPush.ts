// src/lib/sendPush.ts

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Expoプッシュ通知を送信する関数
 * @param to ExpoPushToken (例: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]")
 * @param title 通知タイトル
 * @param body 通知本文
 * @param data 任意のデータ（通知タップ時に使える）
 */
export async function sendExpoPush(
  to: string,
  title: string,
  body: string,
  data?: any
) {
  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([{ to, sound: "default", title, body, data }]),
  });

  const json = await res.json();

  if (!json?.data || json.data[0]?.status !== "ok") {
    console.error("Expo push error:", json);
  } else {
    console.log("✅ Push sent successfully:", json.data[0]);
  }
}
