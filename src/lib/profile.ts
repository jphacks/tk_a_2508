// lib/profile.ts
import { supabase } from "./supabase";

export async function ensureProfileRow() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    await supabase.from("profiles").insert({
      id: user.id,
      name: "名前未設定",
      status: "よろしく！",
    });
  }
  return user.id;
}

export type ProfileRow = {
  name: string | null;
  status: string | null;
  avatar_url: string | null;
  friends_count: number | null;
  posts_count: number | null;
};

export async function fetchMyProfile(): Promise<ProfileRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("name,status,avatar_url,friends_count,posts_count")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(
  patch: Partial<Pick<ProfileRow, "name" | "status" | "avatar_url">>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);
  if (error) throw error;
}
