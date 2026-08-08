import React, { useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import { Typography } from "@mui/material";
import AppButton from "@base/components/app-button/appButton";
import { ButtonVariant } from "@base/type/appButton";
import { useQuery } from "@tanstack/react-query";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as WarningIcon } from "assets/WarningIcon.svg";
import { removeStudentFromClass } from "@base/api/classes";
import { Student } from "@pages/class-page/view-class-page/viewClass";

interface DeleteStudentPopUpProps {
  open: boolean;
  onClose: () => void;
  student: Student;
  classId: string;
  setIsFetchingClass: (data: boolean) => void;
}

const DeleteStudentPopUp = ({
  open,
  onClose,
  student,
  classId,
  setIsFetchingClass,
}: DeleteStudentPopUpProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // query to add a lesson
  const deleteStudentQuery = useQuery({
    enabled: isDeleting,
    queryKey: ["removeStudentFromClass", student.id],
    queryFn: () => removeStudentFromClass(classId, student.id),
  });

  const onDelete = () => {
    setIsDeleting(true);
  };

  useEffect(() => {
    if (deleteStudentQuery.isSuccess && isDeleting) {
      setIsDeleting(false);
      onClose();
      setIsFetchingClass(true);
    }
  }, [deleteStudentQuery]);

  return (
    <PopUpModal
      popUpTitle='Delete Student'
      open={open}
      onClose={onClose}
      minWidth='930px'
      minHeight='500px'
    >
      <div className='mt-4 flex flex-col self-start h-96 w-full'>
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
            <p>
              Are you sure you want to remove the student {student.name} from
              this class?
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

export default DeleteStudentPopUp;
