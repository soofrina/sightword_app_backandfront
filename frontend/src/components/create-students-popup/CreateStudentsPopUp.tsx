import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import AppButton from "../app-button/appButton";
import AppSelect from "@base/components/organisation-app-select/AppSelect";
import { OptionData } from "@base/type/appSelect";
import PopUpModal from "../popup-model";
import FormTextField from "../form-text-field";
import FormLabel from "../form-label";
import FormSubtext from "../form-subtext";
import FormMultilineTextField from "../form-multiline-text-field";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LearningCentre } from "@base/type/dataTypes";
import { NumberToDay } from "@base/constants/datetime";
import dayjs from "dayjs";

import { useRecoilState, useResetRecoilState } from "recoil";
import atom from "@base/recoil/create-student";

import { CreateStudentData, createStudents } from "@base/api/students";
import { addStudentToClass, getAllClasses } from "@base/api/classes";
import GroupedAppSelect from "../grouped-organisation-app-select";

type ClassOptionsType = { label: string; options: OptionData[] };

interface CreateStudentPopUpProps {
  open: boolean;
  onClose: () => void;
}

const CreateStudentsPopUp = ({ open, onClose }: CreateStudentPopUpProps) => {
  const [createStudent, setCreateStudent] = useRecoilState(atom);
  const resetCreateStudent = useResetRecoilState(atom);
  const [classOptions, setClassOptions] = useState<ClassOptionsType[]>([]);
  const [getClassesFromCentreKey] = useState<string>("getClassesFromCentre");

  const { data: classesData } = useQuery([getClassesFromCentreKey], () => {
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

      if (!centreName) return acc;

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

  // create student
  const createStudentMutation = useMutation(createStudents, {
    onSuccess: (data) => {
      // data contains the newly created student's information

      // Check if we need to add the student to Class 1
      if (
        createStudent.class1?.value !== undefined &&
        createStudent.class1.id !== -1
      ) {
        const studentId = data.data[0].id;
        addStudentToClass(createStudent.class1.value, { studentId });
      }

      // Check if we need to add the student to Class 2
      if (
        createStudent.class2?.value !== undefined &&
        createStudent.class2.id !== -1
      ) {
        const studentId = data.data[0].id;
        addStudentToClass(createStudent.class2.value, { studentId });
      }
    },
  });

  const createOnClick = () => {
    // validation
    let pass = true;
    pass = pass && createStudent.name !== "";
    pass = pass && createStudent.email !== "";
    pass = pass && createStudent.studentId !== "";

    if (!pass) {
      return;
    }

    // Prepare the data for the createStudent API
    const data: CreateStudentData[] = [
      {
        name: createStudent.name,
        email: createStudent.email,
        student_id: createStudent.studentId, // eslint-disable-line
        comment: createStudent.comment,
      },
    ];

    // Trigger the mutation for creating the student
    createStudentMutation.mutate(data);

    resetCreateStudent();
    onClose();
  };

  return (
    <>
      <PopUpModal
        popUpTitle='Create Students'
        open={open}
        onClose={() => {
          onClose();
          resetCreateStudent();
        }}
      >
        <div className='w-full h-full flex flex-col'>
          <div className='flex-grow grid grid-rows-3 grid-cols-3 gap-y-4 gap-x-10 mb-6 mt-3'>
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
              />
            </div>

            <div className='col-start-1 col-end-1 row-start-2 row-end-2 flex flex-col items-start'>
              <FormLabel htmlFor='emailField' required>
                Email
              </FormLabel>
              <FormTextField
                id='emailField'
                value={createStudent.email}
                onChange={(e) =>
                  setCreateStudent((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                errorMsg='This field is compulsory'
                placeholder='Email'
              />
            </div>

            <div className='col-start-1 col-end-1 row-start-3 row-end-3 flex flex-col items-start'>
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
              <GroupedAppSelect
                name='class1Field'
                value={createStudent.class1}
                onChange={(optionData) =>
                  setCreateStudent((prev) => ({ ...prev, class1: optionData }))
                }
                data={classOptions}
                disabled={false}
              />
            </div>

            <div className='col-start-2 col-end-2 row-start-3 row-end-3 flex flex-col items-start'>
              <FormLabel htmlFor='class2Field'>Class 2</FormLabel>
              <Typography
                variant='subtitle1'
                sx={{ fontSize: "10px", color: "#ABABAB" }}
              >
                Class names start with last 4 characters from class id
              </Typography>
              <GroupedAppSelect
                name='class2Field'
                value={createStudent.class2}
                onChange={(optionData) =>
                  setCreateStudent((prev) => ({ ...prev, class2: optionData }))
                }
                data={classOptions}
                disabled={false}
              />
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
              />
            </div>
          </div>
          <div className='w-full h-full'>
            <AppButton className='w-fit float-right' onClick={createOnClick}>
              Create
            </AppButton>
          </div>
        </div>
      </PopUpModal>
    </>
  );
};

export default CreateStudentsPopUp;
