import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

type OngoingClassHeaderProps = {
  day: string;
  date: string;
};

const OngoingClassHeader = ({ day, date }: OngoingClassHeaderProps) => {
  const navigate = useNavigate();
  return (
    <>
      <div className='bg-neutral-50 flex justify-between items-center py-4'>
        <button className='ml-4' onClick={() => navigate(-1)}>
          <ArrowBackIosIcon className='h-5 w-4 text-slate-400' />
        </button>
        <div className='flex flex-col items-center'>
          <div className='font-bold text-base'>{day}</div>
          <div className='font-normal text-base'>{date}</div>
        </div>
        <div className='mr-4'></div> {/* Empty div for symmetry */}
      </div>
    </>
  );
};

export default OngoingClassHeader;
