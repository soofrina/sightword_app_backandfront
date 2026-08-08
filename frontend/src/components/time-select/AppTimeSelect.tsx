import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface AppTimeSelectProps {
  time: string;
  setTime: (newTime: string) => void;
  label?: string;
  className?: string;
  timeSelectColor?: string;
}

const AppTimeSelect = ({
  time,
  setTime,
  label,
  className,
}: AppTimeSelectProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TextField
        id='time'
        type='time'
        label={label}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          style: {
            fontSize: 14,
            height: 6,
          },
        }}
        className={`${className}`}
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    </LocalizationProvider>
  );
};

export default AppTimeSelect;
