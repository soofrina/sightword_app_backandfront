import { PaletteOptions, ThemeOptions } from "@mui/material";
import { palleteLight, palleteDark } from "@constants/themes";

type Mode = "light" | "dark";

export const getModePallete = (mode?: Mode): PaletteOptions => {
  const isLight = mode ? mode === "light" : true;
  const newMode = isLight ? palleteLight : palleteDark;
  return newMode;
};

export const getTheme = (mode?: Mode): ThemeOptions => {
  return {
    palette: {
      ...getModePallete(mode),
    },
  };
};
