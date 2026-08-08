import { useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import AppButton from "@base/components/app-button/appButton";
import TeacherCard from "./teacherCard";
import { Typography } from "@mui/material";
import { TeacherRowFormat } from "./teacherTab";
import { ButtonVariant } from "@base/type/appButton";

import { useQueries } from "@tanstack/react-query";
import { deleteTeacher } from "@base/api/teachers";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as WarningIcon } from "assets/WarningIcon.svg";

interface DeleteStudentsPopUpProps {
  open: boolean;
  onClose: () => void;
  toDelete: TeacherRowFormat[];
  setToDelete: (data: TeacherRowFormat[]) => void;
}

const DeleteTeachersPopUp = ({
  open,
  onClose,
  toDelete,
  setToDelete,
}: DeleteStudentsPopUpProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onCardCancel = (teacherId: string) => {
    if (toDelete.length === 1) {
      // no more students to delete
      onClose();
    }

    setToDelete(
      toDelete.filter((row: TeacherRowFormat) => row.id != teacherId),
    );
  };

  const deleteQueries = useQueries({
    queries: toDelete.map((teacher) => ({
      queryKey: ["deleteTeacher", teacher.id],
      queryFn: () => deleteTeacher(teacher.id),
      enabled: isDeleting,
    })),
  });

  const onDelete = () => {
    setIsDeleting(true);
  };

  useEffect(() => {
    const allDeleted = deleteQueries.every((query) => query.isSuccess);
    if (isDeleting && allDeleted) {
      setIsDeleting(false);
      onClose();
    }
  }, [deleteQueries]);

  return (
    <PopUpModal popUpTitle='Delete Teachers' open={open} onClose={onClose}>
      <div className='mt-5 w-full h-full flex flex-col gap-2 justify-start'>
        <Typography variant='caption' className='font-bold text-[16px]'>
          Selected:
        </Typography>
        <div className='w-full flex flex-row gap-3 overflow-x-auto'>
          {toDelete.map((row: TeacherRowFormat) => (
            <TeacherCard
              key={row.id}
              id={row.id}
              name={row.name}
              learningCentres={row.learningCentres}
              onCancel={onCardCancel}
            />
          ))}
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
            <p>Are you sure you want to delete the account(s) above?</p>
            <p>The account(s) will be permanently disabled.</p>
          </Typography>
        </div>
        <div className='mt-10 flex flex-row gap-4 justify-end'>
          <AppButton
            className='rounded border-opacity-100 text-[#ABABAB] border-[#ABABAB]'
            variant={ButtonVariant.OUTLINED}
            onClick={onClose}
          >
            Cancel
          </AppButton>
          <AppButton
            className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]'
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

export default DeleteTeachersPopUp;
