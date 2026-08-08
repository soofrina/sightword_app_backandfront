import React from "react";
import { Button } from "@mui/material";
import { useRecoilState } from "recoil";

import themeAtom from "@recoil/theme/atom";
import { getTheme } from "@utility/theme";

const RecoilTest = () => {
  const [theme, setTheme] = useRecoilState(themeAtom);

  const swapThemes = () => {
    const isLight = theme.palette?.mode === "light";
    const newMode = isLight ? "dark" : "light";
    const newTheme = getTheme(newMode);
    setTheme(newTheme);
  };

  return (
    <div className='m-5'>
      <div>The current mode is {theme.palette?.mode}</div>
      <Button variant='contained' onClick={swapThemes}>
        Swap Mode
      </Button>
    </div>
  );
};

export default RecoilTest;
