import { useEffect, useState } from "react";
import AppButton from "../app-button/appButton";
import AppSelect from "@base/components/organisation-app-select/AppSelect";
import AppMultiSelect from "../app-multi-select/AppMultiSelect";
import { ButtonVariant } from "@base/type/appButton";
import { OptionData } from "@base/type/appSelect";
import PopUpModal from "../popup-model";
import FormTextField from "../form-text-field";
import FormLabel from "../form-label";
import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import { LearningCentre } from "@base/type/dataTypes";
import { NumberToDay } from "@base/constants/datetime";
import dayjs from "dayjs";

import { useRecoilState, useResetRecoilState } from "recoil";
import atom from "@base/recoil/create-teacher";

import { CreateTeacherData, createTeachers } from "@base/api/teachers";
import { CreateAdminData, createAdmins } from "@base/api/admins";
import { getAllCentres } from "@base/api/centres";
import { addTeacherToClass, getAllClasses } from "@base/api/classes";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CrossIcon } from "assets/Cancel.svg";
import { ReactComponent as PlusIcon } from "@base/assets/plus.svg";
import FormSubtext from "../form-subtext";
import GroupedAppSelect from "../grouped-organisation-app-select";

interface CreateStudentPopUpProps {
  open: boolean;
  onClose: () => void;
}

const roleOptions: OptionData[] = [
  { id: 0, name: "Teacher", value: "teacher" },
  { id: 1, name: "Admin", value: "admin" },
];

type ClassOptionsType = { label: string; options: OptionData[] };

const CreateTeachersPopUp = ({ open, onClose }: CreateStudentPopUpProps) => {
  const [createTeacher, setCreateTeacher] = useRecoilState(atom);
  const resetCreateTeacher = useResetRecoilState(atom);
  const [lcOptions, setLcOptions] = useState<OptionData[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOptionsType[]>([]);

  const [createTeachersKey] = useState<string>("createTeachers");
  const [createAdminsKey] = useState<string>("createAdmins");
  const [getLearningCentresKey] = useState<string>("getLearningCentres");
  const [getClassesKey] = useState<string>("getClasses");
  const [addTeacherToClassKey] = useState<string>("addTeacherToClass");

  const { data: classesData } = useQuery([getClassesKey], () => {
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

  const createTeacherMutation = useMutation(createTeachers, {
    onSuccess: (data) => {
      // data contains the newly created teacher's information

      // Check if we need to promote the teacher to Admin
      if (createTeacher.role === "admin") {
        const adminData: CreateAdminData[] = [{ email: createTeacher.email }];
        createAdmins(adminData);
      }

      // Add the teacher to classes
      createTeacher.classes
        .filter((classData) => classData !== null)
        .forEach((classData) => {
          const teacherId = data.data[0].id;
          addTeacherToClass(classData!.value, {
            teacherId,
            isFormTeacher: false,
          });
        });
    },
  });

  const createOnClick = () => {
    // validation
    let pass = true;
    pass = pass && createTeacher.name !== "";
    pass = pass && createTeacher.email !== "";
    pass = pass && createTeacher.teacherId !== "";

    if (!pass) {
      return;
    }

    // Prepare the data for the createTeacher API
    const data: CreateTeacherData[] = [
      {
        name: createTeacher.name,
        email: createTeacher.email,
        staff_id: createTeacher.teacherId, // eslint-disable-line
      },
    ];

    // Trigger the mutation for creating the teacher
    createTeacherMutation.mutate(data);

    onClose();
  };

  const setClasses = (index: number) => (option: OptionData) => {
    const newClasses = createTeacher.classes.slice();
    newClasses[index] = option;
    setCreateTeacher((prev) => ({ ...prev, classes: newClasses }));
  };

  const removeClass = (index: number) => () => {
    const newClasses = createTeacher.classes.slice();
    newClasses.splice(index, 1);
    setCreateTeacher((prev) => ({ ...prev, classes: newClasses }));
  };

  return (
    <>
      <PopUpModal
        popUpTitle='Create Teachers'
        open={open}
        onClose={() => {
          onClose();
          resetCreateTeacher();
        }}
      >
        <div className='w-full h-full flex flex-col'>
          <div className='flex-grow grid grid-cols-3 gap-y-4 gap-x-10 mb-6 mt-3'>
            <div className='col-start-1 col-end-1 row-start-1 row-end-1 flex flex-col items-start'>
              <FormLabel htmlFor='nameField' required>
                Name
              </FormLabel>
              <FormTextField
                id='nameField'
                value={createTeacher.name}
                onChange={(e) =>
                  setCreateTeacher((prev) => ({
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
                value={createTeacher.email}
                onChange={(e) =>
                  setCreateTeacher((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                errorMsg='This field is compulsory'
                placeholder='Email'
              />
            </div>

            <div className='col-start-1 col-end-1 row-start-3 row-end-3 flex flex-col items-start'>
              <FormLabel htmlFor='teacherIdField' required>
                ID
              </FormLabel>
              <FormTextField
                id='teacherIdField'
                value={createTeacher.teacherId}
                onChange={(e) =>
                  setCreateTeacher((prev) => ({
                    ...prev,
                    teacherId: e.target.value,
                  }))
                }
                errorMsg='This field is compulsory'
                placeholder='12345355'
              />
            </div>

            <div className='col-start-2 col-end-2 row-start-1 row-end-1 flex flex-col items-start'>
              <FormLabel htmlFor='roleField'>Role</FormLabel>
              <AppSelect
                name='roleField'
                value={roleOptions[0]}
                data={roleOptions}
                onChange={(optionData) =>
                  setCreateTeacher((prev) => ({
                    ...prev,
                    role: optionData.value,
                  }))
                }
              />
            </div>

            <div className='col-start-2 col-end-2 row-start-2 row-end-2 flex flex-col items-start'>
              <FormLabel htmlFor='lcField'>Learning Centre</FormLabel>
              <FormSubtext>Based on teacher&apos;s class locations</FormSubtext>
              {createTeacher.learningCentres || "No Classes Yet"}
            </div>

            {createTeacher.classes.map((classData, i) => (
              <div
                key={classData ? classData.value : i}
                className={`col-start-3 col-end-3 row-start-${i + 1} row-end-${
                  i + 1
                } flex flex-col items-start`}
              >
                <FormLabel htmlFor={`class${i + 1}Field`}>
                  Class {i + 1}
                </FormLabel>
                <div className='flex items-center justify-start gap-2'>
                  <GroupedAppSelect
                    name={`class${i + 1}Field`}
                    value={createTeacher.classes[i]}
                    data={classOptions}
                    onChange={setClasses(i)}
                    disabled={false}
                  />
                  <SvgIcon
                    component={CrossIcon}
                    viewBox='0 0 14 14'
                    sx={{
                      width: "14px",
                      cursor: "pointer",
                      path: { fill: "#ABABAB" },
                    }}
                    onClick={removeClass(i)}
                  />
                </div>
              </div>
            ))}

            <div
              className={`col-start-3 col-end-3 row-start-${
                createTeacher.classes.length + 1
              } row-end-${createTeacher.classes.length + 1} flex items-center`}
            >
              <AppButton
                variant={ButtonVariant.OUTLINED}
                startIcon={
                  <SvgIcon
                    component={PlusIcon}
                    sx={{ width: "14px" }}
                    inheritViewBox
                  />
                }
                onClick={() =>
                  setCreateTeacher((prev) => ({
                    ...prev,
                    classes: [...prev.classes, null],
                  }))
                }
              >
                Add Class
              </AppButton>
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

export default CreateTeachersPopUp;
