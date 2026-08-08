import CloudHandler from "./cloud-handler/cloudHandler";
import LineHandler from "./line-handler/lineHandler";

type PreviousLessonHandlerProps = {
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  side: number;
  isLast: boolean;
  id: string;
};

const PreviousLessonHandler = ({
  date,
  day,
  startTime,
  endTime,
  side,
  isLast,
  id,
}: PreviousLessonHandlerProps) => {
  return (
    <div>
      <CloudHandler
        id={id}
        date={date}
        day={day}
        startTime={startTime}
        endTime={endTime}
        side={side}
      />
      {!isLast ? <LineHandler side={side} /> : <></>}
    </div>
  );
};

export default PreviousLessonHandler;
