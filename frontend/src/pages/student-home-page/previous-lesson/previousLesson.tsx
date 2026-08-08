import { Box } from "@mui/material";
import { ReactComponent as Cloud } from "./cloud.svg";
import { ReactComponent as CloudShadow } from "./cloudShadow.svg";

type PreviousLessonProps = {
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  onClick: () => void;
};

const PreviousLesson = ({
  date,
  day,
  startTime,
  endTime,
  onClick,
}: PreviousLessonProps) => {
  const formatTime = () => {
    const formattedStartTime = startTime.replace(" PM", "");
    return `${formattedStartTime}-${endTime}`;
  };

  return (
    <Box
      className='relative flex items-center cursor-pointer'
      onClick={onClick}
    >
      <div>
        <CloudShadow className='absolute z-0 top-1.5' />
        <Cloud className='relative z-10' />
      </div>
      <div
        className='absolute text-center ml-2 z-20'
        style={{ fontSize: "14px" }}
      >
        <div className='font-bold'>{date}</div>
        <div>{day}</div>
        <div style={{ whiteSpace: "nowrap" }}>{`${formatTime()}`}</div>
      </div>
    </Box>
  );
};

export default PreviousLesson;
