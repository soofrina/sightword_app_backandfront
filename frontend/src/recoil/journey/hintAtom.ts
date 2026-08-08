import { localStorageEffect } from "@base/utility/localStorage";
import { atom } from "recoil";

export const hideHintPermanentState = atom<boolean>({
  key: "hideHintPermanentState",
  default: false, // Set your default value here
  // eslint-disable-next-line camelcase
  effects_UNSTABLE: [localStorageEffect<boolean>("hideHintPermanentState")],
});