import { studentRoutes } from "@base/constants/routes";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Flower } from "../flower.svg";

type YourClassesProps = {
  id: string;
  day: string;
  timeRange: string;
  location: string;
};

const YourClasses = ({ id, day, timeRange, location }: YourClassesProps) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`${studentRoutes.classWords}/${id}`)}
      className='inline-flex flex-row justify-between items-center mb-2 gap-2 h-14 bg-neutral-50 shadow-md rounded-md cursor-pointer'
      style={{ width: "max-content" }}
    >
      <div className='p-4 flex flex-col flex-shrink-0 pr-8'>
        <div className='font-helvetica font-normal text-base'>{day}</div>
        <div className='font-helvetica font-normal text-base'>{timeRange}</div>
      </div>
      <div className='p-4 flex-shrink-0 pl-16'>
        <div className='font-helvetica font-normal text-base text-right'>
          {location}
        </div>
      </div>
    </Box>
  );
};

export default YourClasses;
