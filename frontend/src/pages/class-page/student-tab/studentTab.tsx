import SearchBar from "@components/search-bar";
import AppButton from "@components/app-button";
import AddIcon from "@mui/icons-material/Add";
import { ButtonVariant } from "@type/appButton";
import Table from "@components/Table";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as SwapIcon } from "@assets/SwapIcon.svg";
import { ReactComponent as ThrashIcon } from "@assets/ThrashIcon.svg";
import { Student } from "@pages/class-page/view-class-page/viewClass";
import DeleteStudentPopUp from "./deleteStudentPopUp";
import TransferStudentPopup from "@pages/class-page/student-tab/transferStudentPopup";

interface StudentTabProps {
  students: Student[];
  setIsAddStudentModalOpen: (value: boolean) => void;
  classId: string;
  setIsFetchingClass: (value: boolean) => void;
}

export const StudentTab = ({ students, setIsAddStudentModalOpen, classId, setIsFetchingClass }: StudentTabProps) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchText.toLowerCase()));
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [transferModalVisible, setTransferModalVisible] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(undefined);
  const [toTransfer, setToTransfer] = React.useState(undefined);

  const studentColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "id",
      headerName: "ID",
      width: 300,
    },
    {
      field: "lastAttempted",
      headerName: "Last Attempted",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "actions",
      headerName: " ",
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className='flex flex-row gap-2 items-center justify-start'>
            <SvgIcon
              className='cursor-pointer'
              component={SwapIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px" }}
              onClick={() => {
                setToTransfer(params.row);
                setTransferModalVisible(true);
              }}
            />
            <SvgIcon
              className='cursor-pointer'
              component={ThrashIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px" }}
              onClick={() => {
                setToDelete(params.row);
                setDeleteModalVisible(true);
                }
              }
            />
          </div>
        );
      },
    },
  ];

  return (
  <>
    {toTransfer &&
      <TransferStudentPopup
        open={transferModalVisible}
        onClose={() => setTransferModalVisible(false)}
        student={toTransfer}
        classId={classId}
        setIsFetchingClass={setIsFetchingClass} />
    }
    {toDelete &&
        <DeleteStudentPopUp
            setIsFetchingClass={setIsFetchingClass}
            classId={classId}
            student={toDelete} open={deleteModalVisible}
            onClose={() => setDeleteModalVisible(false)} />
    }
    <div className='w-full px-4 py-2 flex flex-row justify-between items-center bg-primaryLight dark:bg-primaryLight-d'>
      <div className='flex flex row gap-3 items-center'>
        <SearchBar className='h-10'
                   placeholder='Search'
                   value={searchText}
                   onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <AppButton
        className='m-2'
        startIcon={<AddIcon />}
        variant={ButtonVariant.SOLID}
        onClick={() => setIsAddStudentModalOpen(true)}
      >
        Add Student
      </AppButton>
    </div>
    <Table columns={studentColumns} rows={filteredStudents} showCheckBox />
  </>
  );

};
