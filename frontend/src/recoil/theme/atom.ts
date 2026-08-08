import { atom } from "recoil";
import { ThemeOptions } from "@mui/material";
import { getModePallete } from "@utility/theme";

const themeAtom = atom<ThemeOptions>({
  key: "themeAtom",
  default: {
    palette: {
      ...getModePallete(),
    },
  },
});

export default themeAtom;
