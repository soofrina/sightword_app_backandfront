import { ReactComponent as Flower } from "../../flower.svg";
import SolidButton from "@base/components/solid-button/solidButton";
import { LessonData } from "@base/type/dataTypes";
import {
  DateToFullDateString,
  getDayNameFromDate,
  getTimeFromDate,
} from "@base/constants/datetime";

type OngoingLessonProps = {
  content: LessonData | null;
  onClick: () => void;
};

const OngoingLesson = ({ content, onClick }: OngoingLessonProps) => {
  return (
    <div className='flex flex-row items-center px-3 py-5 bg-neutral-50 rounded-md px-3 py-4 h-16 w-68 mr-6'>
      <Flower />

      <div className='font-helvatica font-normal text-base border-neutral-50'>
        {content
          ? `${DateToFullDateString(content.startDate)}, ${getDayNameFromDate(
              content.startDate,
            )}, ${getTimeFromDate(content.startDate)}-${getTimeFromDate(
              content.endDate,
            )}`
          : "No upcoming lesson"}
      </div>
      {content && <SolidButton content='Start' width={20} onClick={onClick} />}
    </div>
  );
};

export default OngoingLesson;
