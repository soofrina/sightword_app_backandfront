import React, { useEffect, useState } from "react";

import { Typography } from "@mui/material";

import PopUpModal from "@base/components/popup-model";
import AppButton from "@base/components/app-button";
import { ButtonVariant } from "@base/type/appButton";
import { LearningCentreRowFormat } from "./learningCentreTab";

import { useQueries } from "@tanstack/react-query";
import { deleteCentre } from "@base/api/centres";

interface DeleteLearningCentresPopUpProps {
  open: boolean;
  onClose: () => void;
  toDelete: LearningCentreRowFormat[];
}

const DeleteLearningCentresPopUp: React.FC<DeleteLearningCentresPopUpProps> = ({ open, onClose, toDelete }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteQueries = useQueries({
    queries: toDelete.map(student => ({
        queryKey: ["deleteStudent", student.id],
        queryFn: () => deleteCentre(student.id),
        enabled: isDeleting,
      })
    )
  }); 

  useEffect(() => {
    const allDeleted = deleteQueries.every(query => query.isSuccess);
    if (isDeleting && allDeleted) {
      setIsDeleting(false); 
      onClose();
    }
  }, [deleteQueries]);

  const onDelete = () => {
    setIsDeleting(true);
  };

  return (
    <PopUpModal popUpTitle="Delete Learning Centre" open={open} onClose={onClose}>
      <div className="mt-5 w-full h-full flex flex-col gap-2 justify-start">
        <Typography variant="caption" className="font-bold text-[16px]">Selected:</Typography>

        <div className="w-full flex flex-col gap-1 overflow-y-auto">
          {
            toDelete.map((row: LearningCentreRowFormat) => <Typography key={row.id}>{row.name}</Typography>)
          }
        </div>
        
        <div className="flex-grow mt-10 flex flex-row gap-4 justify-end">
          <AppButton
            className="rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]"
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

export default DeleteLearningCentresPopUp;