/* eslint-disable camelcase */

import { addStudentToClass } from "@base/api/classes";
import PopUpModal from "@base/components/popup-model";
import { Class } from "@base/type/dataTypes";
import atom, { addStudentSelector } from "@recoil/add-student";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import AddStudent from "./add-student";

interface AddStudentPopUpProps {
  open: boolean;
  popUpTitle: string;
  onClose: () => void;
  didAddStudents: () => void;
  currentClass: Class | undefined;
}

const AddStudentPopUp = ({
  open,
  popUpTitle,
  onClose,
  didAddStudents,
  currentClass,
}: AddStudentPopUpProps) => {
  const resetState = useResetRecoilState(atom);

  const [selectedStudents, setSelectedStudents] =
    useRecoilState(addStudentSelector);
  const [isAddingStudents, setIsAddingStudents] = useState(false);

  const handleClose = () => {
    onClose();
    resetState();
  };

  const handleAdd = () => {
    setIsAddingStudents(true);
  };

  // Queries to add students which are selected manually or via import
  const addStudentsQueries = useQueries({
    queries: selectedStudents.map((student, idx) => {
      if (currentClass?.id) {
        return {
          retry: 3,
          queryKey: [`student-${idx}`],
          queryFn: () =>
            addStudentToClass(currentClass.id, { studentId: student.id }),
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
      didAddStudents();
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
      <AddStudent
        handleAdd={handleAdd}
        handleCancel={handleClose}
        excludedStudents={currentClass?.students}
      />
    </PopUpModal>
  );
};

export default AddStudentPopUp;
