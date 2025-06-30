import { User, UserResponse } from "@supabase/supabase-js";
import { create } from "zustand";
import { Tables } from "../../database.types";
import { Profile } from "@/types/types";

// const user: UserResponse | undefined = undefined;
interface UserStore {
  user: User | undefined;
  setUser: (user: User) => void;
  profile: Profile | undefined;
  setProfile: (profile: Profile | undefined) => void;
}

const useUserStore = create<UserStore>(set => ({
  user: undefined,
  setUser: (user: User) => set(() => ({ user })),
  profile: undefined,
  setProfile: profile => set({ profile }),
}));
export default useUserStore;
