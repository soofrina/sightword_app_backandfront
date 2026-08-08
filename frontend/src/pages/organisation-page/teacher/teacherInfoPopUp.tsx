import { useCallback, useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import AppSelect from "@base/components/organisation-app-select/AppSelect";
import { OptionData } from "@base/type/appSelect";
import AppButton from "@base/components/app-button/appButton";
import AppMultiSelect from "@base/components/app-multi-select/AppMultiSelect";
import { ButtonVariant } from "@base/type/appButton";
import FormSubtext from "@base/components/form-subtext";
import FormTextField from "@base/components/form-text-field";
import FormLabel from "@base/components/form-label";
import { LearningCentre, TeacherData } from "@base/type/dataTypes";
import { NumberToDay } from "@base/constants/datetime";
import dayjs from "dayjs";
import { TeacherRowFormat } from "./teacherTab";

import { useRecoilState, useResetRecoilState } from "recoil";
import atom from "@base/recoil/create-teacher";

import { useQueries, useQuery } from "@tanstack/react-query";
import { getAllCentres } from "@base/api/centres";
import {
  addTeacherToClass,
  getAllClasses,
  removeTeacherFromClass,
} from "@base/api/classes";
import { createTeachers, updateTeacher } from "@base/api/teachers";
import { createAdmins, removeAdmin } from "@base/api/admins";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PencilIcon } from "assets/PencilIcon.svg";
import { ReactComponent as CrossIcon } from "assets/Cancel.svg";
import { ReactComponent as PlusIcon } from "@base/assets/plus.svg";
import GroupedAppSelect from "@base/components/grouped-organisation-app-select";

interface TeacherInfoPopUpProps {
  open: boolean;
  onClose: () => void;
  data: TeacherRowFormat | undefined;
  editNow?: boolean; // allow entering pop up to edit right away
}

type ClassOptionsType = { label: string; options: OptionData[] };

const roleOptions: OptionData[] = [
  { id: 0, name: "Teacher", value: "teacher" },
  { id: 1, name: "Admin", value: "admin" },
];

const TeacherInfoPopUp = ({
  open,
  onClose,
  data,
  editNow = false,
}: TeacherInfoPopUpProps) => {
  const [createTeacher, setCreateTeacher] = useRecoilState(atom);
  const resetCreateTeacher = useResetRecoilState(atom);
  const [isEditing, setIsEditing] = useState<boolean>(editNow);

  const [lcOptions, setLcOptions] = useState<OptionData[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOptionsType[]>([]);
  const [hasInitClasses, setHasInitClasses] = useState<boolean>(false);

  const [updateStudentKey] = useState<string>("updateStudent");
  const [getLearningCentresKey] = useState<string>("getLearningCentres");
  const [getClassesKey] = useState<string>("getClasses");
  const [removeAdminKey] = useState<string>("removeAdmin");
  const [createAdminsKey] = useState<string>("createAdmins");

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

  // New user has been selected, populate this form with new info
  useEffect(() => {
    if (data === undefined) {
      return;
    }

    setCreateTeacher((prev) => ({
      ...prev,
      id: data.id,
      teacherId: data.staffId,
      role: data.role,
      name: data.name,
      email: data.email,
      learningCentres: data.learningCentres.join(", "),
      classes: [],
    }));
    setHasInitClasses(false);
  }, [data]);

  // Update learning centre for classes
  useEffect(() => {
    // Make sure createTeacher.classes is defined before attempting to loop over it
    if (createTeacher.classes && classOptions) {
      const learningCentres: string[] = [];

      createTeacher.classes.forEach((classItem) => {
        if (classItem) {
          const classCentre = classOptions.find((group) =>
            group.options.some((option) => option.value === classItem.value),
          )?.label;

          if (classCentre) {
            learningCentres.push(classCentre);
          }
        }
      });
      // Remove duplicates and join with commas
      const uniqueLearningCentres = Array.from(new Set(learningCentres)).join(
        ", ",
      );
      // Update the learningCentre field in createTeacher
      setCreateTeacher((prev) => ({
        ...prev,
        learningCentres: uniqueLearningCentres,
      }));
    }
  }, [createTeacher.classes, classOptions]);

  useEffect(() => {
    if (!data || classOptions.length <= 0 || hasInitClasses) return;

    setCreateTeacher((prev) => ({
      ...prev,
      classes: classOptions
        .filter(
          (classOption) =>
            data.classes.filter(
              (classData) => classData.id === classOption.options[0]?.value,
            ).length > 0,
        )
        .map((classOption) => classOption.options[0]),
    }));
    setHasInitClasses(true);
  }, [data, classOptions, hasInitClasses]);

  /* SAVING LOGIC -> removes all student->class and recreate it again */

  const { refetch: refetchUpdateTeacher } = useQuery(
    [updateStudentKey],
    () => {
      if (!data) return null;

      const updateData: Partial<TeacherData> = {
        name: createTeacher.name,
        staff_id: createTeacher.teacherId, // eslint-disable-line
      };
      return updateTeacher(data.id, updateData);
    },
    { enabled: false },
  );

  const { refetch: refetchRemoveAdmin } = useQuery(
    [removeAdminKey],
    () => {
      if (
        !data?.adminId ||
        data.role === "teacher" ||
        createTeacher.role === "admin"
      )
        return null;

      return removeAdmin(data.adminId);
    },
    { enabled: false },
  );

  const { refetch: refetchCreateAdmin } = useQuery(
    [createAdminsKey],
    () => {
      if (data?.role === "admin" || createTeacher.role === "teacher")
        return null;

      return createAdmins([
        {
          email: createTeacher.email,
        },
      ]);
    },
    { enabled: false },
  );

  // Only remove classes that are no longer needed
  const removeClassesQueries = useQueries({
    queries: (!data ? [] : data.classes)
      .filter(
        (oldClass) =>
          createTeacher.classes.filter(
            (newClass) => newClass && newClass.value === oldClass.id,
          ).length <= 0,
      )
      .map((classData) => ({
        queryKey: ["removeTeacherFromClass", classData!.id],
        queryFn: () => removeTeacherFromClass(classData.id, data!.id),
        enabled: false,
      })),
  });

  const refetchRemoveClasses = useCallback(() => {
    removeClassesQueries.forEach((result) => result.refetch());
  }, [removeClassesQueries]);

  const addClassesQueries = useQueries({
    queries: createTeacher.classes
      .filter(
        (newClass) =>
          newClass &&
          (!data ||
            data.classes.filter((oldClass) => newClass.value === oldClass.id)
              .length <= 0),
      )
      .map((classData) => ({
        queryKey: ["addTeacherToClass", classData!.value],
        queryFn: () =>
          addTeacherToClass(classData!.value, {
            teacherId: data!.id,
            isFormTeacher: false,
          }),
        enabled: false,
      })),
  });

  const refetchAddClasses = useCallback(() => {
    addClassesQueries.forEach((result) => result.refetch());
  }, [addClassesQueries]);

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

  useEffect(() => setIsEditing(editNow), [editNow]);

  const onPopUpClose = () => {
    resetCreateTeacher();
    setIsEditing(false);
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
      popUpTitle={isEditing ? "Edit Details" : createTeacher.name}
      open={open}
      onClose={onPopUpClose}
      altButton={editButton}
    >
      <div className='w-full h-full flex flex-col'>
        <div className='flex-grow grid grid-cols-3 gap-y-4 gap-x-10 mb-6 mt-3'>
          {isEditing && (
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
              value={createTeacher.email}
              onChange={(e) =>
                setCreateTeacher((prev) => ({ ...prev, email: e.target.value }))
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
              value={createTeacher.teacherId}
              onChange={(e) =>
                setCreateTeacher((prev) => ({
                  ...prev,
                  teacherId: e.target.value,
                }))
              }
              errorMsg='This field is compulsory'
              placeholder='12345355'
              disabled={!isEditing}
            />
          </div>

          <div className='col-start-2 col-end-2 row-start-1 row-end-1 flex flex-col items-start'>
            <FormLabel htmlFor='roleField'>Role</FormLabel>
            <AppSelect
              name='roleField'
              value={
                roleOptions.filter(
                  (roleOption) => roleOption.value === createTeacher.role,
                )[0]
              }
              data={roleOptions}
              onChange={(optionData) =>
                setCreateTeacher((prev) => ({
                  ...prev,
                  role: optionData.value,
                }))
              }
              disabled={!isEditing}
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
                  disabled={!isEditing}
                />
                {isEditing && (
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
                )}
              </div>
            </div>
          ))}

          {isEditing && (
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
          )}
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
                refetchUpdateTeacher();
                if (data?.role === "teacher" && createTeacher.role === "admin")
                  refetchCreateAdmin();
                if (data?.role === "admin" && createTeacher.role === "teacher")
                  refetchRemoveAdmin();
                refetchRemoveClasses();
                refetchAddClasses();
                setIsEditing(false);
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

export default TeacherInfoPopUp;
