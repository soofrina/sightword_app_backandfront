import { useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import AppSelect from "@base/components/organisation-app-select/AppSelect";
import { OptionData } from "@base/type/appSelect";
import AppButton from "@base/components/app-button/appButton";
import Typography from "@mui/material/Typography/Typography";
import { StudentRowFormat } from "./studentTab";
import { ButtonVariant } from "@base/type/appButton";
import FormTextField from "@base/components/form-text-field";
import FormLabel from "@base/components/form-label";
import FormSubtext from "@base/components/form-subtext";
import FormMultilineTextField from "@base/components/form-multiline-text-field";
import { LearningCentre } from "@base/type/dataTypes";
import { NumberToDay } from "@base/constants/datetime";
import dayjs from "dayjs";
import { ReactComponent as CrossIcon } from "assets/Cancel.svg";

import { useRecoilState, useResetRecoilState } from "recoil";
import atom from "@base/recoil/create-student";

import { useQuery } from "@tanstack/react-query";
import { getAllCentres, getClassesFromCentre } from "@base/api/centres";
import {
  addStudentToClass,
  getAllClasses,
  removeStudentFromClass,
} from "@base/api/classes";
import { updateStudent, UpdateStudentData } from "@base/api/students";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PencilIcon } from "assets/PencilIcon.svg";
import GroupedAppSelect from "@base/components/grouped-organisation-app-select";

type ClassOptionsType = { label: string; options: OptionData[] };
interface StudentInfoPopUpProps {
  open: boolean;
  onClose: () => void;
  data: StudentRowFormat | undefined;
  editNow?: boolean; // allow entering pop up to edit right away
}

const StudentInfoPopUp = ({
  open,
  onClose,
  data,
  editNow = false,
}: StudentInfoPopUpProps) => {
  const [createStudent, setCreateStudent] = useRecoilState(atom);
  const resetCreateStudent = useResetRecoilState(atom);
  const [isEditing, setIsEditing] = useState<boolean>(editNow);
  const [originalClass1, setOriginalClass1] = useState<OptionData | null>(null);
  const [originalClass2, setOriginalClass2] = useState<OptionData | null>(null);

  // const [lcOptions, setLcOptions] = useState<OptionData[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOptionsType[]>([]);

  // const [hasInitClasses, setHasInitClasses] = useState<boolean>(false);

  const [updateStudentKey] = useState<string>("updateStudent");
  const [getLearningCentresKey] = useState<string>("getLearningCentres");
  const [getClassesFromCentreKey] = useState<string>("getClassesFromCentre");
  const [removeStudentFromClass1] = useState<string>("removeStudentFromClass1");
  const [removeStudentFromClass2] = useState<string>("removeStudentFromClass2");
  const [createStudentFromClass1] = useState<string>("createStudentFromClass1");
  const [createStudentFromClass2] = useState<string>("createStudentFromClass2");

  // Get classes belong to a learning centre
  const { data: classesData } = useQuery([getClassesFromCentreKey], () => {
    // if (createStudent.learningCentre === null) {
    //   return null;
    // }
    return getAllClasses();
  });

  // set classes dropdown data on successful fetch
  useEffect(() => {
    if (classesData?.data === undefined) {
      return;
    }

    // Group classes by learning centre
    const groupedClasses = classesData.data.reduce<{
      [key: string]: OptionData[];
    }>((acc, classData) => {
      const centreName = classData.centre?.name;
      const startTime = dayjs(classData.startTime, "HH:mm:ZZ");
      const endTime = dayjs(classData.endTime, "HH:mm:ZZ");

      const option = {
        // TODO check if id matters
        // id: classData.id,
        id: classData.id,
        name: `${classData.id.slice(-4)}  ${
          NumberToDay[classData.startDay]
        }, ${startTime.format("h")}-${endTime.format("hA")}`,
        value: classData.id,
      };

      if (!centreName) {
        return acc;
      }

      if (!acc[centreName]) {
        acc[centreName] = [];
      }

      acc[centreName].push(option);
      return acc;
    }, {});

    // Convert to the format expected by GroupAppSelect
    const newClassOptions: ClassOptionsType[] = Object.keys(groupedClasses).map(
      (centreName) => ({
        label: centreName,
        options: groupedClasses[centreName],
      }),
    );

    setClassOptions(newClassOptions);
  }, [classesData]);

  // New user has been selected, populate this form with new info
  useEffect(() => {
    if (data === undefined) {
      return;
    }

    setCreateStudent((prev) => ({
      ...prev,
      id: data.id,
      studentId: data.studentId,
      name: data.name,
      email: data.email,
      learningCentre: data.learningCentre, // todo: fill when class/centre info is fetched
      class1: null, // todo: fill when class/centre info is fetched
      class2: null, // todo: fill when class/centre info is fetched
    }));
    // Only value matters as we will compare value to check if anything is changed
    setOriginalClass1(
      data.class1
        ? { id: data.class1.id, value: data.class1.id, name: data.class1.id }
        : null,
    );
    setOriginalClass2(
      data.class2
        ? { id: data.class2.id, value: data.class2.id, name: data.class2.id }
        : null,
    ); // Replace "..." with the appropriate name

    // setHasInitClasses(false);
  }, [data]);

  // populate select
  useEffect(() => {
    if (!data || !classOptions) return;

    let selectedClass1: OptionData | null = null;
    let selectedClass2: OptionData | null = null;

    // Loop through each group to find the selected classes
    classOptions.forEach((group) => {
      const options: OptionData[] = group.options;

      const foundClass1 = options.find(
        (option: OptionData) => data.class1?.id === option.value,
      );
      if (foundClass1) {
        selectedClass1 = foundClass1;
      }

      const foundClass2 = options.find(
        (option: OptionData) => data.class2?.id === option.value,
      );
      if (foundClass2) {
        selectedClass2 = foundClass2;
      }
    });

    setCreateStudent((prev) => ({
      ...prev,
      class1: selectedClass1,
      class2: selectedClass2,
    }));
  }, [data, classOptions]);

  useEffect(() => {
    const learningCentres: string[] = [];

    // Find the learning centre for class1
    if (createStudent.class1) {
      const class1Centre = classOptions.find((group) =>
        group.options.some(
          (option) => option.value === createStudent.class1?.value,
        ),
      )?.label;
      if (class1Centre) {
        learningCentres.push(class1Centre);
      }
    }

    // Find the learning centre for class2
    if (createStudent.class2) {
      const class2Centre = classOptions.find((group) =>
        group.options.some(
          (option) => option.value === createStudent.class2?.value,
        ),
      )?.label;
      if (class2Centre) {
        learningCentres.push(class2Centre);
      }
    }

    // Remove duplicates and join with commas
    const uniqueLearningCentres = Array.from(new Set(learningCentres)).join(
      ", ",
    );

    // Update the learningCentre field in createStudent
    setCreateStudent((prev) => ({
      ...prev,
      learningCentre: uniqueLearningCentres,
    }));
  }, [createStudent.class1, createStudent.class2, classOptions]);

  /* SAVING LOGIC -> removes all student->class and recreate it again */

  const { refetch: refetchUpdateStudent } = useQuery(
    [updateStudentKey],
    () => {
      if (!data) return null;

      const updateData: UpdateStudentData = {
        name: createStudent.name,
        student_id: createStudent.studentId, // eslint-disable-line
        comment: createStudent.comment,
      };
      return updateStudent(data.id, updateData);
    },
    { enabled: false },
  );

  // remove class1 -> student
  const { refetch: refetchRemoveClass1, data: removeClass1FromStudentsData } =
    useQuery(
      [removeStudentFromClass1],
      () => {
        // no change
        if (
          createStudent.class1 &&
          createStudent.class1.value === originalClass1?.value
        ) {
          return null;
        }
        // changed to null
        if (!createStudent.class1) {
          return removeStudentFromClass(
            originalClass1?.value,
            createStudent.id,
          );
        }
        // changed to others
        return removeStudentFromClass(
          createStudent.class1.value,
          createStudent.id,
        );
      },
      { enabled: false },
    );

  // remove class2 -> student
  const { refetch: refetchRemoveClass2, data: removeClass2FromStudentsData } =
    useQuery(
      [removeStudentFromClass2],
      () => {
        // no change
        if (
          createStudent.class2 &&
          createStudent.class2.value === originalClass2?.value
        ) {
          return null;
        }
        // changed to null
        if (!createStudent.class2) {
          return removeStudentFromClass(
            originalClass2?.value,
            createStudent.id,
          );
        }
        // changed to others
        return removeStudentFromClass(
          createStudent.class2.value,
          createStudent.id,
        );
      },
      { enabled: false },
    );

  // create class1 -> student
  useQuery(
    [createStudentFromClass1, removeStudentFromClass1],
    () => {
      if (
        createStudent.class1 == null ||
        createStudent.class1?.value === undefined ||
        createStudent.class1.id === -1
      )
        return;

      /* eslint-disable camelcase */
      return addStudentToClass(createStudent.class1.value, {
        studentId: createStudent.id,
      });
    },
    { enabled: !!removeClass1FromStudentsData },
  );

  // create class2 -> student
  useQuery(
    [createStudentFromClass2, removeStudentFromClass2],
    () => {
      if (
        createStudent.class2 == null ||
        createStudent.class2?.value === undefined ||
        createStudent.class2.id === -1
      )
        return;

      /* eslint-disable camelcase */
      return addStudentToClass(createStudent.class2.value, {
        studentId: createStudent.id,
      });
    },
    { enabled: !!removeClass2FromStudentsData },
  );

  useEffect(() => setIsEditing(editNow), [editNow]);

  const onPopUpClose = () => {
    setIsEditing(false);
    resetCreateStudent();
    onClose();
  };

  const editButton = (
    <SvgIcon
      component={PencilIcon}
      viewBox='0 0 24 24'
      sx={{ width: "18px", cursor: "pointer" }}
      onClick={() => setIsEditing(true)}
    />
  );

  return (
    <PopUpModal
      popUpTitle={isEditing ? "Edit Details" : createStudent.name}
      open={open}
      onClose={onPopUpClose}
      altButton={editButton}
    >
      <div className='w-full h-full flex flex-col'>
        <div className='flex-grow grid grid-rows-3 grid-cols-3 gap-y-4 gap-x-10 mb-6 mt-3'>
          {isEditing && (
            <div className='col-start-1 col-end-1 row-start-1 row-end-1 flex flex-col items-start'>
              <FormLabel htmlFor='nameField' required>
                Name
              </FormLabel>
              <FormTextField
                id='nameField'
                value={createStudent.name}
                onChange={(e) =>
                  setCreateStudent((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                errorMsg='This field is compulsory'
                placeholder='Name'
                disabled={!isEditing}
              />
            </div>
          )}

          <div
            className={`row-start-${isEditing ? 2 : 1} row-end-${
              isEditing ? 2 : 1
            } col-start-1 col-end-1 flex flex-col items-start`}
          >
            <FormLabel htmlFor='emailField' required>
              Email
            </FormLabel>
            <FormTextField
              id='emailField'
              value={createStudent.email}
              onChange={(e) =>
                setCreateStudent((prev) => ({ ...prev, email: e.target.value }))
              }
              errorMsg='This field is compulsory'
              placeholder='Email'
              disabled={!isEditing}
            />
          </div>

          <div
            className={`row-start-${isEditing ? 3 : 2} row-end-${
              isEditing ? 3 : 2
            } col-start-1 col-end-1 flex flex-col items-start`}
          >
            <FormLabel htmlFor='studentIdField' required>
              ID
            </FormLabel>
            <FormTextField
              id='studentIdField'
              value={createStudent.studentId}
              onChange={(e) =>
                setCreateStudent((prev) => ({
                  ...prev,
                  studentId: e.target.value,
                }))
              }
              errorMsg='This field is compulsory'
              placeholder='12345355'
              disabled={!isEditing}
            />
          </div>

          <div className='col-start-2 col-end-2 row-start-1 row-end-1 flex flex-col items-start'>
            <>
              <FormLabel htmlFor='lcField'>
                Student Learning Centre(s)
              </FormLabel>
              <FormSubtext>
                Based on student&apos;s class 1 and 2 locations
              </FormSubtext>
              {createStudent.learningCentre || "No Classes Yet"}
            </>
          </div>

          <div className='col-start-2 col-end-2 row-start-2 row-end-2 flex flex-col items-start'>
            <FormLabel htmlFor='class1Field'>Class 1</FormLabel>
            <FormSubtext>
              Class names start with last 4 characters from class id
            </FormSubtext>
            <div className='flex items-center'>
              <GroupedAppSelect
                name='class1Field'
                value={createStudent.class1}
                onChange={(optionData) =>
                  setCreateStudent((prev) => ({ ...prev, class1: optionData }))
                }
                data={classOptions}
                disabled={!isEditing}
              />
              {isEditing && (
                <SvgIcon
                  className='ml-2'
                  component={CrossIcon}
                  viewBox='0 0 14 14'
                  sx={{
                    width: "14px",
                    cursor: "pointer",
                    path: { fill: "#ABABAB" },
                  }}
                  onClick={() =>
                    setCreateStudent((prev) => ({
                      ...prev,
                      class1: null,
                    }))
                  }
                />
              )}
            </div>
          </div>

          <div className='col-start-2 col-end-2 row-start-3 row-end-3 flex flex-col items-start'>
            <FormLabel htmlFor='class2Field'>Class 2</FormLabel>
            <Typography
              variant='subtitle1'
              sx={{ fontSize: "10px", color: "#ABABAB" }}
            >
              Class names start with last 4 characters from class id
            </Typography>{" "}
            <div className='flex items-center'>
              <GroupedAppSelect
                name='class2Field'
                value={createStudent.class2}
                onChange={(optionData) =>
                  setCreateStudent((prev) => ({ ...prev, class2: optionData }))
                }
                data={classOptions}
                disabled={!isEditing}
              />
              {isEditing && (
                <SvgIcon
                  className='ml-2'
                  component={CrossIcon}
                  viewBox='0 0 14 14'
                  sx={{
                    width: "14px",
                    cursor: "pointer",
                    path: { fill: "#ABABAB" },
                  }}
                  onClick={() =>
                    setCreateStudent((prev) => ({
                      ...prev,
                      class2: null,
                    }))
                  }
                />
              )}
            </div>
          </div>

          <div className='col-start-3 col-end-3 row-span-full flex flex-col items-start'>
            <FormLabel htmlFor='commentField'>Comment</FormLabel>
            <FormMultilineTextField
              id='commentField'
              multiline
              placeholder='Type here...'
              minRows={3}
              value={createStudent.comment}
              onChange={(e) =>
                setCreateStudent((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              disabled={!isEditing}
            />
          </div>
        </div>
        {isEditing && (
          <div className='w-full mt-10 flex flex-row gap-4 justify-end'>
            <AppButton
              className='rounded border-opacity-100 text-[#ABABAB] border-[#ABABAB]'
              variant={ButtonVariant.OUTLINED}
              onClick={onPopUpClose}
            >
              Cancel
            </AppButton>
            <AppButton
              className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]'
              variant={ButtonVariant.SOLID}
              onClick={() => {
                refetchUpdateStudent();
                refetchRemoveClass1();
                refetchRemoveClass2();
              }}
            >
              Update
            </AppButton>
          </div>
        )}
      </div>
    </PopUpModal>
  );
};

export default StudentInfoPopUp;
