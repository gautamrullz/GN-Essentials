import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

import { Profile } from "@/types/profile";

export async function getCurrentProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return getProfileByUser(user);
}

export async function getProfileByUser(user: User): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);

    return null;
  }

  return data as Profile;
}

export async function getCurrentRole() {
  const profile = await getCurrentProfile();

  return profile?.role ?? null;
}
