import React, { useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import { Typography } from "@mui/material";
import AppButton from "@base/components/app-button/appButton";
import { ButtonVariant } from "@base/type/appButton";
import { useQuery } from "@tanstack/react-query";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as WarningIcon } from "assets/WarningIcon.svg";
import { deleteClass } from "@base/api/classes";
import { useNavigate } from "react-router-dom";
import { staffRoutes } from "@constants/routes";

interface DeleteClassPopupProps {
  open: boolean;
  onClose: () => void;
  classId: string;
  day: string;
  time: string;
}

const DeleteClassPopUp = ({
  open,
  onClose,
  classId,
  day,
  time,
}: DeleteClassPopupProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const navigate = useNavigate();

  // query to add a lesson
  const deleteClassQuery = useQuery({
    enabled: isDeleting,
    queryKey: ["deleteClass", classId],
    queryFn: () => deleteClass(classId),
  });

  const onDelete = () => {
    setIsDeleting(true);
  };

  useEffect(() => {
    if (deleteClassQuery.isSuccess && isDeleting) {
      navigate(-1);
    }
  }, [deleteClassQuery]);

  return (
    <PopUpModal
      popUpTitle='Delete Student'
      open={open}
      onClose={onClose}
      minWidth='930px'
      minHeight='500px'
    >
      <div className='mt-4 flex flex-col self-start h-96 w-full'>
        <div className='mb-16'>
          <p>
            <b>Selected:</b>
          </p>
          <p>
            <b>{`${day} ${time}`}</b>
          </p>
        </div>
        <div
          className='w-full h-fit rounded p-4 grid grid-rows-3 gap-x-3 gap-y-2'
          style={{
            backgroundColor: "#F7E1D2",
            gridTemplateColumns: "min-content 1fr",
          }}
        >
          <SvgIcon
            component={WarningIcon}
            viewBox='0 0 29 26'
            className='col-start-1 col-span-1 row-start-1 row-span-1'
          />
          <Typography
            className='col-start-2 col-span-1 row-start-1 row-span-1 font-bold'
            sx={{ color: "#FF6D56" }}
          >
            Warning
          </Typography>
          <Typography
            variant='caption'
            className='col-start-2 col-span-1 row-start-2 row-span-2'
            sx={{ color: "#FF6D56" }}
          >
            <p>Are you sure you want to delete class above?</p>
            <p>
              You will no longer be able to access the Class and its details.
            </p>
          </Typography>
        </div>
        <div className='self-end mt-auto'>
          <AppButton
            className='rounded border-opacity-100 text-[#ABABAB] border-[#ABABAB] m-2'
            variant={ButtonVariant.OUTLINED}
            onClick={onClose}
          >
            Cancel
          </AppButton>
          <AppButton
            className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF] m-2'
            variant={ButtonVariant.SOLID}
            onClick={onDelete}
          >
            Delete
          </AppButton>
        </div>
      </div>
    </PopUpModal>
  );
};

export default DeleteClassPopUp;
