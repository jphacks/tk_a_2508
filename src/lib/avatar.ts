// lib/avatar.ts
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";

async function pickImageOnce() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") throw new Error("写真ライブラリの権限がありません");
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true, // 正方形にトリミングしたい場合
    aspect: [1, 1],
    quality: 0.9,
  });
  if (res.canceled) return null;
  return res.assets[0];
}

async function uriToBlob(uri: string): Promise<Blob> {
  const r = await fetch(uri);
  return await r.blob();
}

/** アイコンを選んでアップロード → 公開URLを返す（Public バケット前提） */
export async function pickAndUploadAvatar(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");

  const asset = await pickImageOnce();
  if (!asset) return null;

  const ext = asset.fileName?.split(".").pop() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const file = await uriToBlob(asset.uri);
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    contentType: asset.mimeType ?? "image/jpeg",
  });
  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
