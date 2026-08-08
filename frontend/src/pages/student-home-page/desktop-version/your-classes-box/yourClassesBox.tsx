import { militaryTimeToDefaultFormat } from "@base/api/classes";
import { NumberToDay } from "@base/constants/datetime";
import { ClassDataStudentsTeachers } from "@base/type/dataTypes";
import YourClasses from "../../your-classes/yourClasses";

type YourClassesBoxProps = {
  classes: ClassDataStudentsTeachers[];
};

const YourClassesBox = ({ classes }: YourClassesBoxProps) => {
  return (
    <div className='bg-rose-50 px-5 flex flex-col rounded h-72 '>
      <div className='mt-10 font-bold text-xl'>YOUR CLASSES</div>
      <div className='mt-4 mb-8 overflow-auto h-full'>
        <div className='flex flex-col'>
          {classes.map((yourClass) => {
            // Convert military time to default format
            const startTime = militaryTimeToDefaultFormat(
              yourClass.startTime.slice(0, 5),
            );
            const endTime = militaryTimeToDefaultFormat(
              yourClass.endTime.slice(0, 5),
            );

            // Get the day of the week based on the startDay
            const day = NumberToDay[yourClass.startDay];

            return (
              <YourClasses
                id={yourClass.id}
                day={day}
                timeRange={`${startTime}-${endTime}`}
                key={yourClass.id}
                location={yourClass.centre?.name || "Unknown"}
              />
            );
          })}
          {classes.length === 0 && (
            <div className='text-center text-lg font-normal'>
              You have no classes yet!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourClassesBox;
