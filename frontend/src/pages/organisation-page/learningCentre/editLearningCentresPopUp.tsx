import React, { useEffect, useState } from "react";

import { TextField, Typography } from "@mui/material";

import PopUpModal from "@base/components/popup-model";
import AppButton from "@base/components/app-button";
import { ButtonVariant } from "@base/type/appButton";
import { LearningCentreRowFormat } from "./learningCentreTab";

import { useQuery } from "@tanstack/react-query";
import { updateCentre } from "@base/api/centres";

interface EditLearningCentrePopUpProps {
  open: boolean;
  onClose: () => void;
  toEdit: LearningCentreRowFormat | undefined;
}

const EditLearningCentrePopUp: React.FC<EditLearningCentrePopUpProps> = ({ open, onClose, toEdit }) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");

  const [updateLearningCentreKey] = useState<string>("udpateLearningCentrekey");

  const { isSuccess } = useQuery([updateLearningCentreKey], () => {
    if (!toEdit || !newName) return null;

    return updateCentre(toEdit.id, {
      id: toEdit.id,
      name: newName
    });
  }, { enabled: isUpdating });

  // close pop up if update request succeeds
  useEffect(() => {
    if (isSuccess && isUpdating) {
      setIsUpdating(false);
      onClose();
    };
  }, [isSuccess]);

  const onUpdate = () => {
    setIsUpdating(true);
  };

  return (
    <PopUpModal popUpTitle="Edit Learning Centre" open={open} onClose={onClose}>
      <div className="mt-5 w-full h-full flex flex-col gap-2 justify-start">

        <div className="w-full flex flex-col gap-5 overflow-y-auto">
            <div className="flex flex-col">
              <Typography variant="caption" className="font-bold text-[16px]">Selected:</Typography>
              <Typography>{toEdit?.name}</Typography>
            </div>

            <div className="flex flex-col">
              <Typography variant="caption" className="font-bold text-[16px]">New Learning Centre Name:</Typography>
              <TextField 
                className="w-[60%]" 
                size="small" 
                placeholder="Learning Centre Name" 
                value={newName}
                onChange={(event:  React.ChangeEvent<HTMLInputElement>) => setNewName(event.target.value)}
              />
            </div>
        </div>
        
        <div className="flex-grow mt-10 flex flex-row gap-4 justify-end">
          <AppButton
            className="rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]"
            variant={ButtonVariant.SOLID}
            onClick={onUpdate}
          >
            Update
          </AppButton>
        </div>
      </div>
    </PopUpModal>
  );
};

export default EditLearningCentrePopUp;