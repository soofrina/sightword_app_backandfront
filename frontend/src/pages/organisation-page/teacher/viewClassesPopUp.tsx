import { useEffect, useState } from "react";
import dayjs from "dayjs";

import PopUpModal from "@base/components/popup-model";
import { NumberToDay } from "@base/constants/datetime";
import { MassClassData } from "@base/type/dataTypes";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { staffRoutes } from "@base/constants/routes";

export interface WeekClassData {
  day: string;
  classesData: MassClassData[];
}

const Lane = ({ day, classesData }: WeekClassData) => {
  return (
    <div className='bg-[#F1F1F1] w-full max-w-full flex flex-col gap-2 justify-start p-2 rounded-md'>
      <Typography variant='caption' className='ml-5 font-bold text-[16px]'>
        {day}
      </Typography>
      <div className='overflow-x-auto flex flex-row gap-3 p-1 justify-start'>
        {classesData.map((classData: MassClassData) => {
          const startTime = dayjs(classData.startTime, "HH:mm:ZZ");
          const endTime = dayjs(classData.endTime, "HH:mm:ZZ");
          return (
            <NavLink
              to={`${staffRoutes.viewClass}/${classData.id}`}
              key={classData.id}
              className='bg-white border-[#F4A295] flex flex-col gap-1 m-2 p-2 border rounded-md min-w-fit'
            >
              <Typography
                variant='caption'
                className='text-[16px] text-[#F4A295]'
              >{`${NumberToDay[classData.startDay]}, ${startTime.format(
                "h",
              )}-${endTime.format("hA")}`}</Typography>
              <Typography
                variant='caption'
                className='text-[16px] text-[#F4A295]'
              >
                {classData.centre.name}
              </Typography>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

interface ViewClassesPopUpProps {
  open: boolean;
  onClose: () => void;
  teacherName: string;
  classesData: MassClassData[];
}

const ViewClassesPopUp = ({
  open,
  onClose,
  teacherName,
  classesData,
}: ViewClassesPopUpProps) => {
  const [uniqueDays, setUniqueDays] = useState<number[]>([]);

  useEffect(() => {
    const tempUniqueDays = new Set<number>();
    classesData.forEach((classData) => {
      tempUniqueDays.add(classData.startDay);
    });

    setUniqueDays(Array.from(tempUniqueDays).sort());
  }, [classesData]);

  return (
    <PopUpModal
      popUpTitle={`${teacherName}'s Classes`}
      open={open}
      onClose={onClose}
    >
      <div className='mt-5 w-full flex flex-col gap-5 justify-start items-start'>
        {uniqueDays.map((day: number) => (
          <Lane
            key={day}
            day={NumberToDay[day]}
            classesData={classesData.filter(
              (classData) => classData.startDay === day,
            )}
          />
        ))}
      </div>
    </PopUpModal>
  );
};

export default ViewClassesPopUp;
