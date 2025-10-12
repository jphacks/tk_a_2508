// lib/avatar.ts
import { supabase } from "./supabase";

/** アイコンを選んでアップロード → 公開URLを返す（Public バケット前提） */
export async function pickAndUploadAvatar(): Promise<string | null> {
  // 一時的にプレースホルダー画像を返す
  // 実際の実装では、expo-image-pickerが利用可能になったら実装する
  console.log("pickAndUploadAvatar: プレースホルダー実装");
  return "https://via.placeholder.com/150/42A5F5/FFFFFF?text=Avatar";
}
