/* eslint-disable camelcase */

import { addTeacherToClass } from "@base/api/classes";
import PopUpModal from "@base/components/popup-model";
import { Class } from "@base/type/dataTypes";
import atom, { addTeacherSelector } from "@recoil/add-teacher";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import AddTeacher from "./add-teacher";

interface AddTeacherPopUpProps {
  open: boolean;
  popUpTitle: string;
  onClose: () => void;
  didAddTeacher: () => void;
  currentClass: Class | undefined;
}

const AddTeacherPopUp = ({
  open,
  popUpTitle,
  onClose,
  didAddTeacher,
  currentClass,
}: AddTeacherPopUpProps) => {
  const [selectedTeachers, setSelectedTeachers] =
    useRecoilState(addTeacherSelector);
  const [isAddingStudents, setIsAddingStudents] = useState(false);
  const resetState = useResetRecoilState(atom);

  const handleClose = () => {
    onClose();
    resetState();
  };

  const handleAdd = () => {
    setIsAddingStudents(true);
  };

  // Queries to add students which are selected manually or via import
  const addStudentsQueries = useQueries({
    queries: selectedTeachers.map((teacher, idx) => {
      if (currentClass?.id) {
        return {
          retry: 3,
          queryKey: [`student-${idx}`],
          queryFn: () =>
            addTeacherToClass(currentClass.id, {
              teacherId: teacher.id,
              isFormTeacher: false,
            }),
          enabled: isAddingStudents,
        };
      } else {
        return {};
      }
    }),
  });

  const isLoading = addStudentsQueries.some((query) => query.isLoading);

  useEffect(() => {
    if (!isLoading) {
      setIsAddingStudents(false);
      resetState();
      didAddTeacher();
    }
  }, [isLoading]);

  return (
    <PopUpModal
      open={open}
      popUpTitle={popUpTitle}
      onClose={handleClose}
      minWidth='930px'
      minHeight='500px'
    >
      <AddTeacher
        handleAdd={handleAdd}
        handleCancel={handleClose}
        excludedTeachers={currentClass?.teachers}
      />
    </PopUpModal>
  );
};

export default AddTeacherPopUp;
