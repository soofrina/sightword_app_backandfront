import { getTheme } from "@base/utility/theme";
import { FormControlLabel } from "@material-ui/core";
import { Radio, RadioGroup } from "@mui/material";
import themeAtom from "@recoil/theme/atom";
import { useRecoilState } from "recoil";

const LightDark = () => {
  const [theme, setTheme] = useRecoilState(themeAtom);
  return (
    <div>
      <RadioGroup
        className=''
        aria-labelledby='demo-controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        value={theme.palette?.mode}
      >
        <FormControlLabel
          value='light'
          control={<Radio onClick={() => setTheme(getTheme("light"))} />}
          label='Light'
        />
        <FormControlLabel
          value='dark'
          control={<Radio onClick={() => setTheme(getTheme("dark"))} />}
          label='Dark'
        />
      </RadioGroup>
    </div>
  );
};

export default LightDark;
