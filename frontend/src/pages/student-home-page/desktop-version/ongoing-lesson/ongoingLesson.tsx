// import PencilSvg from "./pencil-svg/pencilSvg";
import { militaryTimeToDefaultFormat } from "@base/api/classes";
import SolidButton from "@base/components/solid-button/solidButton";
import {
  DateToFullDateString,
  getDayNameFromDate,
  getTimeFromDate,
} from "@base/constants/datetime";
import { LessonData } from "@base/type/dataTypes";
import pencil from "./pencil.png";

type OngoingLessonProps = {
  content: LessonData | null;
  onClick: () => void;
};

const OngoingLesson = ({ content, onClick }: OngoingLessonProps) => {
  return (
    <div className='h-72 w-1/2 bg-rose-50 rounded flex flex-col relative'>
      <div className='ml-16 mt-10 z-50 bg-white bg-opacity-70 p-3 rounded w-80'>
        <div className='font-bold text-xl'>UPCOMING LESSONS</div>
        {content ? (
          <>
            <div className='mt-2.5 text-3xl font-bold w-72'>
              {`${DateToFullDateString(content.startDate)},`}
            </div>
            <div className='text-3xl font-bold w-72'>{`${getDayNameFromDate(
              content.startDate,
            )},`}</div>
            <div className='text-3xl font-bold w-72'>{`${getTimeFromDate(
              content.startDate,
            )}-${getTimeFromDate(content.endDate)}`}</div>

            <div className='mt-5'>
              <SolidButton content='START' width={64} onClick={onClick} />
            </div>
          </>
        ) : (
          <div className='mt-5 text-3xl font-bold w-72'>No upcoming lesson</div>
        )}
      </div>
      <img
        src={pencil}
        alt='pencil'
        height={300}
        width={300}
        className='absolute bottom-0 right-0'
      />
    </div>
  );
};

export default OngoingLesson;
