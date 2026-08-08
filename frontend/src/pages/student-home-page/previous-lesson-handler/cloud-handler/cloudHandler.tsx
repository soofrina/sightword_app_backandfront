import { studentRoutes } from "@base/constants/routes";
import { useNavigate } from "react-router-dom";
import PreviousLesson from "../../previous-lesson/previousLesson";

type CloudHandlerProps = {
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  side: number;
  id: string;
};

const CloudHandler = ({
  date,
  day,
  startTime,
  endTime,
  side,
  id,
}: CloudHandlerProps) => {
  const pos = side === 0 ? "justify-start" : "justify-end";
  const navigate = useNavigate();

  return (
    <div className={`flex flex-row mx-8 ${pos}`}>
      <PreviousLesson
        date={date}
        day={day}
        startTime={startTime}
        endTime={endTime}
        onClick={() => navigate(`${studentRoutes.lessonDetails}/${id}`)}
      />
    </div>
  );
};

export default CloudHandler;
