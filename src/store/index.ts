import { User, UserResponse } from "@supabase/supabase-js";
import { create } from "zustand";
import { Tables } from "../../database.types";

// const user: UserResponse | undefined = undefined;
interface UserStore {
  user: User | undefined;
  setUser: (user: User) => void;
  profile: Tables<"employees"> | undefined;
  setProfile: (profile: Tables<"employees"> | undefined) => void;
}

const useUserStore = create<UserStore>(set => ({
  user: undefined,
  setUser: (user: User) => set(() => ({ user })),
  profile: undefined,
  setProfile: profile => set({ profile }),
}));
export default useUserStore;
