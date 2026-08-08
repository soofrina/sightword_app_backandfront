import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import avatar from "@assets/avatar.png";
import { MouseEventHandler } from "react";
import { TeacherData } from "@type/dataTypes";
import useCardSelected from "./useCardSelected";
import AppButton from "../app-button";
import { ButtonVariant } from "@base/type/appButton";
import { staffRoutes, viewClassPageParameters } from "@base/constants/routes";
import { useNavigate } from "react-router-dom";
import { getAvatar, getTimeText } from "@base/utility/common";
import { Dayjs } from "dayjs";
import { NumberToDay } from "@base/constants/datetime";

interface ClassCardProps {
  id: string;
  selected?: boolean;
  isClassesPage?: boolean;
  day: string;
  startTime: Dayjs;
  endTime: Dayjs;
  location: string;
  teachers: TeacherData[];
  onClick?: MouseEventHandler<HTMLDivElement>;
  selectClass?: () => void;
  unselectClass: () => void;
}

interface ClassCardButtonGroupProps {
  id: string;
}

const ClassCardButtonGroup = ({ id }: ClassCardButtonGroupProps) => {
  const navigate = useNavigate();
  const viewClassUrl = `${staffRoutes.viewClass}/${id}?${viewClassPageParameters.overview}`;
  const lessonsUrl = `${staffRoutes.viewClass}/${id}?${viewClassPageParameters.lessonPlans}`;
  return (
    <div className='flex justify-center items-center'>
      <AppButton
        onClick={() => navigate(viewClassUrl)}
        className='mr-2'
        variant={ButtonVariant.GHOST}
      >
        View Class
      </AppButton>
      <AppButton
        onClick={() => navigate(lessonsUrl)}
        variant={ButtonVariant.OUTLINED}
      >
        View Lessons
      </AppButton>
    </div>
  );
};

const ClassCard = ({
  id,
  day,
  startTime,
  endTime,
  location,
  teachers,
  onClick,
  selected,
  selectClass = () => undefined,
  unselectClass = () => undefined,
}: ClassCardProps) => {
  const { ref } = useCardSelected(unselectClass);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onClick) {
      onClick(event);
    }
    selectClass();
  };

  return (
    <Box
      ref={ref}
      sx={{
        backgroundColor: "primary.light",
        borderColor: "text.selectedButton",
      }}
      className={`inline-block h-60 w-64 rounded-xl hover:cursor-pointer ${
        selected && "border-2 border-solid border-selectedButton"
      }`}
      onClick={handleClick}
    >
      <div className='h-20'>
        <div className='flex h-2/4 p-4'>
          <Typography
            sx={{ color: "text.primary" }}
            className='font-bold mr-2 capitalize'
          >
            {NumberToDay[parseInt(day)]}
          </Typography>
          <Typography sx={{ color: "text.secondary" }} className='font-bold'>
            {`${getTimeText(startTime)}-${getTimeText(endTime)}`}
          </Typography>
        </div>
        <div className=' flex items-center h-2/4 p-4'>
          <span className='material-icons text-selected mr-3'>location_on</span>
          <Typography
            sx={{ color: "text.disabled" }}
            className='font-bold uppercase text-xs'
          >
            {location}
          </Typography>
        </div>
      </div>
      <hr />
      <div className='p-4 h-28'>
        <div className='text-xxs flex flex-col justify-start'>
          <p className='text-sublineText'>ASSIGNED TEACHERS</p>
          <div className='w-min'>
            <AvatarGroup max={4}>
              {teachers.map((t, idx) => (
                <Avatar
                  key={`${id}-avatar-teacher-${idx}`}
                  className='h-9 w-9'
                  alt={t.name}
                  src={getAvatar(t.name)}
                />
              ))}
            </AvatarGroup>
          </div>
        </div>
      </div>
      <div>
        <ClassCardButtonGroup id={id} />
      </div>
    </Box>
  );
};

export default ClassCard;
