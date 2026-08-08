import React, { useEffect, useRef, useState } from "react";
import { parse } from "papaparse";

import AppButton from "@base/components/app-button";
import PopUpModal from "@base/components/popup-model/PopUpModal";
import { ButtonVariant } from "@base/type/appButton";
import { TextField, Typography } from "@mui/material";

import { createCentres } from "@base/api/centres";

import { ReactComponent as CancelIcon } from "assets/Cancel.svg";

interface AddLearningCentrePopUpProps {
  open: boolean;
  onClose: () => void;
}

const AddLearningCentrePopUp: React.FC<AddLearningCentrePopUpProps> = ({
  open,
  onClose,
}: AddLearningCentrePopUpProps) => {
  const [newName, setNewName] = useState<string>("");
  const [fileChosen, setFileChosen] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  // triggers when file is selected with click
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFileChosen(e.target.files[0]);
    }
  };

  // Parse CSV if csv is selected and initiate create request to backend
  const onCreate = async () => {
    if (!fileChosen && !newName) return;
    let centres: string[] = [];
    if (fileChosen) {
      parse(fileChosen, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data as { LC: string; [key: string]: unknown }[];
          if (data.length <= 0 || !("LC" in data[0])) return;
          centres = data.map((row) => row["LC"] as string);
        },
      });
    } else {
      centres = [newName];
    }

    const resp = await createCentres(centres);
    if (resp) {
      setNewName("");
      setFileChosen(undefined);
      onClose();
    }
  };

  return (
    <PopUpModal
      popUpTitle='Create Learning Centre'
      open={open}
      onClose={onClose}
    >
      <div className='mt-5 w-full h-full flex flex-col gap-2 justify-start'>
        <div className='w-full flex flex-col gap-8 overflow-y-auto'>
          <div className='flex flex-col gap-2'>
            <Typography variant='caption' className='font-bold text-[16px]'>
              Learning Centre Name:{" "}
            </Typography>
            <Typography variant='caption' className='text-[#ABABAB]'>
              Learning Centre Names must be unique
            </Typography>
            <TextField
              className='w-[60%] bg-white border-0'
              size='small'
              placeholder='Learning Centre Name'
              value={newName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNewName(event.target.value)
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Typography variant='caption' className='font-bold text-[16px]'>
              Or Upload Learning Centre
            </Typography>

            {fileChosen && (
              <div className='w-fit flex justify-between items-center gap-10 p-2 bg-white rounded-lg'>
                <Typography className='text-[#ABABAB]'>
                  {fileChosen.name}
                </Typography>
                <CancelIcon
                  className='h-3 w-3'
                  onClick={() => {
                    setFileChosen(undefined);
                    setNewName("");
                  }}
                />
              </div>
            )}

            <AppButton
              variant={ButtonVariant.OUTLINED}
              className='w-fit'
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              Browse File
            </AppButton>
          </div>
        </div>

        <div className='flex-grow mt-10 flex flex-row gap-4 justify-end'>
          <AppButton
            className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]'
            variant={ButtonVariant.SOLID}
            onClick={onCreate}
          >
            Create
          </AppButton>
        </div>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept='.csv'
        className='hidden'
        onChange={handleChange}
      />
    </PopUpModal>
  );
};

export default AddLearningCentrePopUp;
