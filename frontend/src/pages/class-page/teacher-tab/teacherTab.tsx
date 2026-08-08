import SearchBar from "@components/search-bar";
import AppButton from "@components/app-button";
import AddIcon from "@mui/icons-material/Add";
import { ButtonVariant } from "@type/appButton";
import Table from "@components/Table";
import React, { useState } from "react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Teacher } from "@pages/class-page/view-class-page/viewClass";
import { Link } from "react-router-dom";
import { MassClassData } from "@base/type/dataTypes";
import { Typography } from "@mui/material";
import ViewClassesPopUp from "@base/pages/organisation-page/teacher/viewClassesPopUp";
import { getClassesByTeacherId } from "@base/api/classes";

interface TeacherTabProps {
  teachers: Teacher[];
  setIsAddTeacherModalOpen: (value: boolean) => void;
}

export const TeacherTab = ({
  teachers,
  setIsAddTeacherModalOpen,
}: TeacherTabProps) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const [popupTeacherName, setPopupTeacherName] = useState<string>("");
  const [popupTeacherClasses, setPopupTeacherClasses] = useState<
    MassClassData[]
  >([]);
  const [showTeacherClasses, setShowTeacherClasses] = useState<boolean>(false);

  const teacherColumns: GridColDef[] = [
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
      field: "role",
      headerName: "Role",
      width: 100,
    },
    {
      field: "learningCentre",
      headerName: "Learning Centre",
      width: 150,
    },
    {
      field: "classes",
      headerName: "Classes",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography
            sx={{
              textDecoration: "underline",
              color: "#18289C",
              cursor: "pointer",
            }}
            onClick={() => {
              getClassesByTeacherId(params.row.id).then((res) => {
                const massClassData: MassClassData[] = res.data.map((c) => {
                  return {
                    ...c,
                  };
                });
                setPopupTeacherClasses(massClassData);
              });
              setPopupTeacherName(params.row.name);
              setShowTeacherClasses(true);
            }}
          >
            View all classes
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
  ];

  return (
    <>
      <div className='w-full px-4 py-2 flex flex-row justify-between items-center bg-primaryLight dark:bg-primaryLight-d'>
        <ViewClassesPopUp
          open={showTeacherClasses}
          onClose={() => {
            setShowTeacherClasses(false);
          }}
          teacherName={popupTeacherName}
          classesData={popupTeacherClasses}
        />
        <div className='flex flex row gap-4 items-center'>
          <SearchBar
            className='h-10'
            placeholder='Search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <AppButton
          className='m-2'
          startIcon={<AddIcon />}
          variant={ButtonVariant.SOLID}
          onClick={() => setIsAddTeacherModalOpen(true)}
        >
          Add Teacher
        </AppButton>
      </div>
      <Table columns={teacherColumns} rows={filteredTeachers} showCheckBox />
    </>
  );
};
