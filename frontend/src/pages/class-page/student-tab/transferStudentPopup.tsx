import { useEffect, useState } from "react";
import PopUpModal from "@base/components/popup-model";
import AppButton from "@base/components/app-button/appButton";
import { ButtonVariant } from "@base/type/appButton";
import { useQuery } from "@tanstack/react-query";
import {
  addStudentToClass,
  removeStudentFromClass,
  getAllClasses,
} from "@base/api/classes";
import { Student } from "@pages/class-page/view-class-page/viewClass";
import { ClassData } from "@type/dataTypes";
import dayjs from "dayjs";
import { FormControl, MenuItem } from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getTimeText } from "@utility/common";

interface TransferStudentPopUpProps {
  open: boolean;
  onClose: () => void;
  student: Student;
  classId: string;
  setIsFetchingClass: (data: boolean) => void;
}

const TransferStudentPopup = ({
  open,
  onClose,
  student,
  classId,
  setIsFetchingClass,
}: TransferStudentPopUpProps) => {
  const [classesData, setClassesData] = useState<ClassData[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [centre, setCentre] = useState<string>("");
  const [time, setTime] = useState<ClassData | null>(null);
  const [transferClassId, setTransferClassId] = useState<string>("");

  const getClasses = useQuery({
    queryKey: ["getAllClasses"],
    retry: 5,
    queryFn: () => getAllClasses(),
  });

  useEffect(() => {
    if (getClasses.data) {
      setClassesData(getClasses.data.data);
    }
  }, [getClasses.data]);

  const deleteStudentQuery = useQuery({
    enabled: isDeleting,
    queryKey: ["removeStudentFromClass", student.id],
    queryFn: () => removeStudentFromClass(classId, student.id),
  });

  const addStudentQuery =
    transferClassId !== undefined
      ? useQuery({
          enabled: isAdding,
          queryKey: ["addStudent", student.id],
          queryFn: () =>
            addStudentToClass(transferClassId, { studentId: student.id }),
        })
      : undefined;

  const onTransfer = () => {
    setIsDeleting(true);
    setIsAdding(true);
  };

  useEffect(() => {
    if (
      deleteStudentQuery.isSuccess &&
      isDeleting &&
      addStudentQuery?.isSuccess &&
      isAdding
    ) {
      setIsDeleting(false);
      setIsAdding(false);
      onClose();
      setIsFetchingClass(true);
    }
  }, [deleteStudentQuery, addStudentQuery]);

  const handleCentreChange = (event: SelectChangeEvent) => {
    setCentre(event.target.value);
    setTime(null);
    setTransferClassId("");
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    const selectedClassId = event.target.value;
    const selectedClass = classesByCentre.find(
      (classItem) => classItem.id === selectedClassId,
    );
    if (selectedClass) {
      setTime(selectedClass);
      setTransferClassId(selectedClass.id);
    }
  };

  const getUniqueCentres = (data: ClassData[]): string[] => {
    const centreSet = new Set<string>();
    data.forEach((item) => {
      const centreName = item?.centre?.name;
      if (centreName && !centreSet.has(centreName)) {
        centreSet.add(centreName);
      }
    });
    return Array.from(centreSet).sort((a, b) => a.localeCompare(b));
  };

  const uniqueCentres = getUniqueCentres(
    classesData.filter((classData) => classData.id !== classId),
  );

  const getClassesByCentre = (centreName: string): ClassData[] => {
    return classesData.filter(
      (classItem) => classItem?.centre?.name === centreName,
    );
  };

  const classesByCentre = centre
    ? getClassesByCentre(centre).sort((a, b) => {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
      })
    : [];
  return (
    <PopUpModal
      popUpTitle='Transfer Student'
      open={open}
      onClose={onClose}
      minWidth='930px'
      minHeight='500px'
    >
      <div className='mt-4 flex flex-col self-start h-96 w-full'>
        <div>
          <FormControl fullWidth>
            <span>
              <b>Move to:</b>
            </span>
            <Select value={centre} onChange={handleCentreChange}>
              {uniqueCentres.map((centreName) => (
                <MenuItem key={centreName} value={centreName}>
                  {centreName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {centre && (
            <FormControl fullWidth className='mt-4'>
              <span>
                <b>Class</b>
              </span>
              <Select value={time?.id || ""} onChange={handleTimeChange}>
                {classesByCentre.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {`${getTimeText(dayjs(classItem.startTime, "HH:mm:ssZ"))} - 
                    ${getTimeText(dayjs(classItem.endTime, "HH:mm"))}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <div className='self-end mt-auto'>
          <AppButton
            className='rounded border-opacity-100 text-[#ABABAB] border-[#ABABAB] m-2'
            variant={ButtonVariant.OUTLINED}
            onClick={onClose}
          >
            Cancel
          </AppButton>
          <AppButton
            className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF] m-2'
            variant={ButtonVariant.SOLID}
            onClick={onTransfer}
          >
            Transfer
          </AppButton>
        </div>
      </div>
    </PopUpModal>
  );
};

export default TransferStudentPopup;
