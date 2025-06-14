import React from "react";
import { createClient } from "../../../../utils/supabase/server";
import ProfileComponent from "@/components/ProfilePage/Profile/ProfileComponent";
import { redirect } from "next/navigation";

export default async function page() {
  const supabase = await createClient();
  // const user = await supabase.auth.getUser();
  const profile = await supabase.from("employees").select().single();

  if (profile.error) {
    redirect("/error");
  }

  return <ProfileComponent profile={profile.data} />;
}
