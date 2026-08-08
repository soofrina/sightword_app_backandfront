import Typography from "@mui/material/Typography/Typography";

import SvgIcon from "@mui/material/SvgIcon/SvgIcon";
import { ReactComponent as CancelIcon } from "assets/Cancel.svg";

interface TeacherCardProps {
  id: string;
  name: string;
  learningCentres: string[];
  onCancel: (teacherId: string) => void;
}

const TeacherCard = (props: TeacherCardProps) => {
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
          {props.name}
        </Typography>
        <Typography variant='caption' sx={{ color: "#ABABAB" }}>
          {props.learningCentres.join(", ")}
        </Typography>
      </div>
      <SvgIcon
        component={CancelIcon}
        viewBox='0 0 14 14'
        sx={{ width: "14px" }}
        onClick={() => props.onCancel(props.id)}
      />
    </div>
  );
};

export default TeacherCard;
