/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AppButton from "@components/app-button";
import { ButtonVariant } from "@type/appButton";
import { Class, CreateLessonData, Lesson } from "@type/dataTypes";
import { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { createLesson } from "@base/api/lessons";

interface AddTeacherPopUpProps {
  open: boolean;
  popUpTitle: string;
  onClose: () => void;
  handleAddLesson: (lesson: Lesson) => void;
  currentClass: Class | undefined;
}

const AddLessonPopup = ({
  open,
  popUpTitle,
  onClose,
  handleAddLesson,
  currentClass,
}: AddTeacherPopUpProps) => {
  const handleClose = () => {
    onClose();
  };
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [addLessonData, setAddLessonData] = useState<CreateLessonData>();

  const handleAdd = () => {
    if (selectedDate && currentClass) {
      const newLessonData: CreateLessonData = {
        start_date: selectedDate.toDate(),
        end_date: selectedDate.toDate(),
        class_id: currentClass.id,
      };
      setAddLessonData(newLessonData);
      setIsAddingLesson(true);
    } else {
      // TODO: Show error here
    }
  };

  // query to add a lesson
  const addLessonQuery = useQuery({
    enabled: isAddingLesson,
    queryKey: ["addLessonQuery"],
    queryFn: () => (addLessonData ? createLesson(addLessonData) : {}),
  });

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (addLessonQuery.isSuccess) {
      handleAddLesson({
        date: selectedDate?.format("DD MMM YYYY") || "",
        words: [],
      });
      setIsAddingLesson(false);
    }
  }, [addLessonQuery.isSuccess]);

  return (
    <PopUpModal
      open={open}
      popUpTitle={popUpTitle}
      onClose={handleClose}
      minWidth='930px'
      minHeight='500px'
    >
      <div className='mt-4 flex flex-col self-start h-96 w-full'>
        <span>
          <b>Lesson</b>
        </span>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className='w-1/3'
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} label='Select a date' />
            )}
          />
        </LocalizationProvider>
        <div className='self-end mt-auto'>
          <AppButton
            className='m-2'
            variant={ButtonVariant.OUTLINED}
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            className='m-2'
            variant={ButtonVariant.SOLID}
            onClick={handleAdd}
          >
            Add
          </AppButton>
        </div>
      </div>
    </PopUpModal>
  );
};

export default AddLessonPopup;
