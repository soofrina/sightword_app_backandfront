import { User, UserToken } from "@base/type/user";
import { string } from "prop-types";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userAtom = atom<User>({
  key: "userAtom",
  default: {
    id: "",
    email: "",
    roleNames: [],
    lastLoggedIn: "",
  },
  // eslint-disable-next-line camelcase
  effects_UNSTABLE: [persistAtom],
});

export const tokenAtom = atom<UserToken>({
  key: "tokenAtom",
  default: {
    accessToken: "",
    refreshToken: "",
  },
  // eslint-disable-next-line camelcase
  effects_UNSTABLE: [persistAtom],
});
