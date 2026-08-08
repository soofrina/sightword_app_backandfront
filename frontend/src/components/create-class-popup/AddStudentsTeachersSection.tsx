import { ButtonColor, ButtonVariant } from "@type/appButton";
import AppButton from "@components/app-button";
import { CreateClassAddMethod } from "@type/createClassPopUp";
import { useState } from "react";
import AddStudentsTeachersImport from "./AddStudentsTeachersImport";
import AddStudentTeachersManual from "./AddStudentTeachersManual";

const AddStudentTeachersSection = () => {
  const [addStudentsTeachersMethod, setAddStudentsTeachersMethod] =
    useState<CreateClassAddMethod>(CreateClassAddMethod.NOT_SELECTED);

  switch (addStudentsTeachersMethod) {
    case CreateClassAddMethod.NOT_SELECTED:
      return (
        <>
          <AppButton
            className='py-2 px-3 mr-2'
            variant={ButtonVariant.OUTLINED}
            color={ButtonColor.SECONDARY}
            onClick={() =>
              setAddStudentsTeachersMethod(CreateClassAddMethod.MANUAL)
            }
          >
            Add Manually
          </AppButton>
          <AppButton
            className='py-2 px-3'
            variant={ButtonVariant.OUTLINED}
            onClick={() =>
              setAddStudentsTeachersMethod(CreateClassAddMethod.IMPORT)
            }
          >
            Import from File
          </AppButton>
        </>
      );
    case CreateClassAddMethod.MANUAL:
      return <AddStudentTeachersManual />;
    case CreateClassAddMethod.IMPORT:
      return <AddStudentsTeachersImport />;
    default:
      return <></>;
  }
};

export default AddStudentTeachersSection;
