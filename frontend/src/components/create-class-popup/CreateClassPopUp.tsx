/* eslint-disable camelcase */

import { daysOfWeek, DayToDate, getDayNumericValue } from "@constants/datetime";
import AppDropdown from "@components/app-dropdown";
import PopUpModal from "@base/components/popup-model";
import { DropdownColor, DropdownVariant } from "@type/appDropdown";
import AppTimeSelect from "@components/time-select/AppTimeSelect";
import AppButton from "@components/app-button";
import AddStudentTeachersSection from "./AddStudentsTeachersSection";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ClassData, CreateClassData } from "@type/dataTypes";
import { getAllCentres } from "@api/centres";
import {
  addTeacherToClass,
  addStudentToClass,
  createClass,
  CreateClassResponseData,
} from "@base/api/classes";
import { convertTimeStringToFormat } from "@base/utility/dates";

import atom, {
  createClassCentreSelector,
  createClassDaySelector,
  createClassEndTimeSelector,
  createClassStartTimeSelector,
  createClassStudentsSelector,
  createClassTeachersSelector,
} from "@recoil/create-class";
import { toast } from "react-toastify";

interface CreateClassPopUpProps {
  open: boolean;
  popUpTitle: string;
  onClose: () => void;
  handleClassAdded: () => void;
}

const CreateClassPopUp = ({
  open,
  popUpTitle,
  onClose,
  handleClassAdded,
}: CreateClassPopUpProps) => {
  // States
  const [startTime, setStartTime] = useRecoilState(
    createClassStartTimeSelector,
  );
  const [selectedStudents] = useRecoilState(createClassStudentsSelector);
  const [selectedTeachers] = useRecoilState(createClassTeachersSelector);
  const [endTime, setEndTime] = useRecoilState(createClassEndTimeSelector);
  const [day, setDay] = useRecoilState(createClassDaySelector);
  const [centre, setCentre] = useRecoilState(createClassCentreSelector);
  const resetState = useResetRecoilState(atom);

  // Query Functions
  const { data: centresData } = useQuery({
    queryKey: ["getCentres"],
    queryFn: () => getAllCentres(),
  });

  // Event Handlers
  const handleClose = () => {
    onClose();
    resetState();
  };

  const handleCreateClass = async () => {
    if (!isDataValid()) {
      return;
    }

    // Set datetime to be correct day and time.
    const newDay = getDayNumericValue(day);
    const newStartTime = convertTimeStringToFormat(startTime);
    const newEndTime = convertTimeStringToFormat(endTime);

    const createClassData: CreateClassData = {
      centreId: centre.id,
      startDay: newDay,
      endDay: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    const resp: ClassData = await createClass(createClassData);
    if (!resp) {
      toast.error("Failed to create class");
    }

    if (!resp.id) {
      toast.error("Internal error: no class id");
      return;
    }

    const addTeacherQueries = Promise.all(
      selectedTeachers.map(async (teacher) => {
        return addTeacherToClass(resp.id, {
          teacherId: teacher.id,
          isFormTeacher: false,
        });
      }),
    );
    const addStudentQueries = Promise.all(
      selectedStudents.map(async (student) => {
        return addStudentToClass(resp.id, { studentId: student.id });
      }),
    );
    const teacherResp = await addTeacherQueries;
    const studentResp = await addStudentQueries;
    if (!teacherResp || !studentResp) {
      toast.error("Failed to add teachers or students to class");
    }
    handleClassAdded();
  };

  // Helper functions
  const isDataValid = () => {
    // If no centre chosen, invalid
    if (!centre.id || !centre.name) {
      return false;
    }

    // If no time chosen, invalid
    if (!startTime || !endTime) {
      return false;
    }

    // If start time is after end time, invalid.
    if (!isStartTimeBeforeEndTime()) {
      return false;
    }

    if (!DayToDate[day]) {
      return false;
    }

    return true;
  };

  const isStartTimeBeforeEndTime = () => {
    const startTimeSplit = startTime.split(":");
    const endTimeSplit = endTime.split(":");
    const startTimeHour = startTimeSplit[0];
    const startTimeMinutes = startTimeSplit[1];
    const endTimeHour = endTimeSplit[0];
    const endTimeMinutes = endTimeSplit[1];

    return (
      startTimeHour < endTimeHour ||
      (startTimeHour === endTimeHour && startTimeMinutes < endTimeMinutes)
    );
  };

  return (
    <PopUpModal
      open={open}
      popUpTitle={popUpTitle}
      onClose={handleClose}
      minWidth='930px'
      minHeight='500px'
    >
      <div className='flex pt-4'>
        <div className='mr-14'>
          <div>
            <p className='font-bold'>Session</p>
            <div className='my-6'>
              <div className='flex'>
                <div className='mr-2 w-36'>
                  <p>Day</p>
                  <AppDropdown
                    title={day || "Day"}
                    data={daysOfWeek.map((day, index) => {
                      return {
                        title: day,
                        id: index,
                        onClick: () => setDay(day),
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
              title={centre.name || "Learning Centre"}
              data={
                centresData
                  ? centresData.data.map((centre, idx) => {
                      return {
                        title: centre.name,
                        id: idx,
                        onClick: () => setCentre(centre),
                      };
                    })
                  : []
              }
              dropdownColor={DropdownColor.SECONDARY}
              dropdownVariant={DropdownVariant.GHOST}
            />
          </div>
        </div>
        <div className='h-96 w-96'>
          <p className='font-bold mb-8'>Add Students and Teachers</p>
          <AddStudentTeachersSection />
        </div>
      </div>
      <div className='absolute bottom-5 right-5'>
        <AppButton onClick={handleCreateClass}>Create Class</AppButton>
      </div>
    </PopUpModal>
  );
};

export default CreateClassPopUp;
