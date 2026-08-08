import { useEffect, useState } from "react";
import { daysOfWeek } from "@constants/datetime";
import AppDropdown from "@components/app-dropdown";
import PopUpModal from "@base/components/popup-model";
import { DropdownColor, DropdownVariant } from "@type/appDropdown";
import AppTimeSelect from "@components/time-select/AppTimeSelect";
import AppButton from "@components/app-button";
import { useRecoilState, useResetRecoilState } from "recoil";
import atom, {
  editClassCentreIdSelector,
  editClassCentreSelector,
  editClassDaySelector,
  editClassEndTimeSelector,
  editClassStartTimeSelector,
} from "@recoil/edit-class";
import { CentreData, Class } from "@type/dataTypes";
import { getAllCentres } from "@base/api/centres";
import { useQuery } from "@tanstack/react-query";
import { updateClass } from "@base/api/classes";
import {
  dayNumToString,
  StringToDayNum,
  convertTimeStringToFormat,
} from "@utility/dates";
import { EditClassData } from "@type/editClassPopUp";
import { getMilitaryTimeText, getTimeText } from "@base/utility/common";

interface EditClassPopUpProps {
  open: boolean;
  popUpTitle: string;
  onClose: () => void;
  handleEditClass: () => void;
  currentClass: Class | undefined;
}

const EditClassPopUp = ({
  open,
  popUpTitle,
  onClose,
  handleEditClass,
  currentClass,
}: EditClassPopUpProps) => {
  const [startTime, setStartTime] = useRecoilState(editClassStartTimeSelector);
  const [endTime, setEndTime] = useRecoilState(editClassEndTimeSelector);
  const [day, setDay] = useRecoilState(editClassDaySelector);
  const [centre, setCentre] = useRecoilState(editClassCentreSelector);
  const [centreId, setCentreId] = useRecoilState(editClassCentreIdSelector);
  const resetState = useResetRecoilState(atom);

  const [editData, setEditData] = useState<EditClassData | undefined>();
  const [isEditingClass, setIsEditingClass] = useState(false);

  const handleClose = () => {
    onClose();
    resetState();
  };

  const handleEdit = () => {
    const editClassData: EditClassData = {
      centreId: centreId,
      startTime: convertTimeStringToFormat(startTime),
      endTime: convertTimeStringToFormat(endTime),
      startDay: day,
      endDay: day,
      centre,
    };
    setEditData(editClassData);
    setIsEditingClass(true);
  };

  const { data: centresData } = useQuery({
    queryKey: ["getCentres"],
    queryFn: () => getAllCentres(),
  });

  // Query to edit class
  const editClassQuery = useQuery({
    enabled: isEditingClass,
    queryKey: ["editClass"],
    queryFn: () =>
      editData && currentClass?.id
        ? updateClass(currentClass.id, editData)
        : {},
  });

  useEffect(() => {
    if (currentClass) {
      setDay(StringToDayNum(currentClass.day));
      setStartTime(getMilitaryTimeText(currentClass.startTime));
      setEndTime(getMilitaryTimeText(currentClass.endTime));
      setCentre(currentClass.learningCentre);
      const currentClassCentreId = centresData?.data.find(
        (c) => c.name === currentClass.learningCentre,
      )?.id;
      if (currentClassCentreId) {
        setCentreId(currentClassCentreId);
      }
    }
  }, [currentClass]);

  useEffect(() => {
    if (editClassQuery.isSuccess) {
      resetState();
      setIsEditingClass(false);
      handleEditClass();

      // remove query to allow users to call more than once
      editClassQuery.remove();
    }
  }, [editClassQuery.isSuccess]);

  return (
    <PopUpModal
      open={open}
      popUpTitle={popUpTitle}
      onClose={handleClose}
      minWidth='930px'
      minHeight='500px'
    >
      <div className='flex pt-4 self-start'>
        <div className='mr-14'>
          <div>
            <p className='font-bold'>Session</p>
            <div className='my-6'>
              <div className='flex'>
                <div className='mr-2 w-36'>
                  <p>Day</p>
                  <AppDropdown
                    title={dayNumToString(day) || "Day"}
                    data={daysOfWeek.map((day, index) => {
                      return {
                        title: day,
                        id: index,
                        onClick: () => setDay(StringToDayNum(day)),
                      };
                    })}
                    dropdownColor={DropdownColor.SECONDARY}
                    dropdownVariant={DropdownVariant.GHOST}
                  />
                </div>
                <div className='mr-2'>
                  <p>Start Time</p>
                  <AppTimeSelect
                    className='w-32'
                    time={startTime}
                    setTime={setStartTime}
                  />
                </div>
                <div>
                  <p>End Time</p>
                  <AppTimeSelect
                    className='w-32'
                    time={endTime}
                    setTime={setEndTime}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className='font-bold'>Learning Centre</p>
            <AppDropdown
              className='my-6 bg-white'
              title={centre || "Learning Centre"}
              data={
                centresData?.data?.map((centre: CentreData, index) => {
                  return {
                    title: centre.name,
                    id: index,
                    onClick: () => {
                      setCentreId(centre.id);
                      setCentre(centre.name);
                    },
                  };
                }) ?? []
              }
              dropdownColor={DropdownColor.SECONDARY}
              dropdownVariant={DropdownVariant.GHOST}
            />
          </div>
        </div>
      </div>
      <div className='absolute bottom-5 right-5'>
        <AppButton onClick={handleEdit}>Edit Class Details</AppButton>
      </div>
    </PopUpModal>
  );
};

export default EditClassPopUp;
