import { NumberToDay } from "@base/constants/datetime";
import { MassClassData } from "@base/type/dataTypes";
import { Typography } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

import { ReactComponent as CancelIcon } from "assets/Cancel.svg";
import dayjs from "dayjs";

interface StudentCardProps {
  studentId: string;
  studentName: string;
  studentClass: MassClassData | null;
  learningCentre: string;
  onCancel: (studentId: string) => void;
}

const StudentCard = ({
  studentId,
  studentName,
  studentClass,
  learningCentre,
  onCancel,
}: StudentCardProps) => {
  let classText = "";
  
  if (studentClass) {
    const startTime = dayjs(studentClass.startTime, "HH:mm:ZZ");
    const endTime = dayjs(studentClass.endTime, "HH:mm:ZZ");
    classText = `${NumberToDay[studentClass.startDay]}, ${startTime.format("h")}-${endTime.format("hA")}`;
  }

  return (
    <div className='bg-white rounded w-fit p-2 flex flex-row gap-2 justify-start'>
      <div
        className='flex flex-col'
        style={{ minWidth: "120px", minHeight: "90px" }}
      >
        <Typography
          variant='caption'
          className='font-bold'
          sx={{ color: "#ABABAB" }}
        >
          {studentName}
        </Typography>
        <Typography variant='caption' sx={{ color: "#ABABAB" }}>
          {classText}
        </Typography>
        <Typography variant='caption' sx={{ color: "#ABABAB" }}>
          {learningCentre}
        </Typography>
      </div>
      <SvgIcon
        component={CancelIcon}
        viewBox='0 0 14 14'
        sx={{ width: "14px" }}
        onClick={() => onCancel(studentId)}
      />
    </div>
  );
};

export default StudentCard;
