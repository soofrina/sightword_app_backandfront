import { ChangeEvent, useEffect, useState } from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography/Typography";
import AppDropdown from "@base/components/app-dropdown/AppDropdown";
import AppSelect from "@base/components/organisation-app-select/AppSelect";
import AppButton from "@base/components/app-button/appButton";
import SearchBar from "@base/components/search-bar/searchBar";
import Table from "../../../components/Table";
import BulkImportPopUp from "@base/components/bulk-import-popup";
import { ImportTarget } from "@base/components/bulk-import-popup/BulkImportPopUp";
import CreateStudentsPopUp from "@base/components/create-students-popup";
import { ButtonVariant } from "@base/type/appButton";
import { OptionData as DropdownOptionData } from "@base/type/appDropdown";
import {
  OptionData,
  OptionData as SelectOptionData,
} from "@base/type/appSelect";
import DeleteStudentsPopUp from "./deleteStudentsPopUp";
import StudentInfoPopUp from "./studentInfoPopUp";
import { MassClassData } from "@base/type/dataTypes";
import { NumberToDay } from "@base/constants/datetime";

import { useQuery } from "@tanstack/react-query";
import { getMassStudents } from "@base/api/students";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PlusIcon } from "@base/assets/plus.svg";
import { ReactComponent as EyeIcon } from "assets/EyeIcon.svg";
import { ReactComponent as ThrashIcon } from "assets/ThrashIcon.svg";

export type StudentRowFormat = {
  id: string;
  studentId: string;
  email: string;
  name: string;
  class1: MassClassData | null;
  class2: MassClassData | null;
  learningCentre: string;
  comment?: string;
};

const getColSelectData = (
  rows: StudentRowFormat[],
  col: keyof StudentRowFormat,
) => {
  // Generates the unique set of a specific field for the filter dropdown
  const options = new Set<string>();
  rows.forEach(
    (row: StudentRowFormat) => row[col] && options.add(row[col] as string),
  );

  const selectData: SelectOptionData[] = [];
  let rollingId = 0;
  selectData.push({
    name: "Show all",
    value: "all",
    id: rollingId++,
  });

  options.forEach((value: string) => {
    selectData.push({
      name: value,
      value: value,
      id: rollingId++,
    });
  });

  return selectData;
};

const dayOfClassDropdown: SelectOptionData[] = [
  { name: "Show all", value: "all", id: 0 },
  { name: "Monday", value: "Monday", id: 1 },
  { name: "Tuesday", value: "Tuesday", id: 2 },
  { name: "Wednesday", value: "Wednesday", id: 3 },
  { name: "Thursday", value: "Thursday", id: 4 },
  { name: "Friday", value: "Friday", id: 5 },
  { name: "Saturday", value: "Saturday", id: 6 },
  { name: "Sunday", value: "Sunday", id: 7 },
];

const StudentTab = () => {
  // Pop Up open/close control
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [showBulkImport, setShowBulkImport] = useState<boolean>(false);
  const [showCreateStudents, setShowCreateStudents] = useState<boolean>(false);
  const [showAltControl, setShowAltControl] = useState<boolean>(false);
  const [showDeleteStudents, setShowDeleteStudents] = useState<boolean>(false);
  const [showStudentInfo, setShowStudentInfo] = useState<boolean>(false);

  // Pop Up data
  const [selectionIds, setSelectionIds] = useState<GridSelectionModel>([]);
  const [toDeleteStudents, setToDeleteStudents] = useState<StudentRowFormat[]>(
    [],
  );
  const [toViewStudent, setToViewStudent] = useState<
    StudentRowFormat | undefined
  >();
  const [editViewStudentNow, setEditViewStudentNow] = useState<boolean>(false);

  // Table data
  const [tableRows, setTableRows] = useState<StudentRowFormat[]>([]);
  const [filteredTableRows, setFilteredTableRows] = useState<
    StudentRowFormat[]
  >([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [lcFilter, setLcFilter] = useState<string>("all");
  const [classDayFilter, setClassDayFilter] = useState<string>("all");

  const getStudentsData = async () => {
    const allStudentsData = await getMassStudents();
    if (!allStudentsData?.data) {
      return;
    }

    setTableRows(
      allStudentsData.data.map((student) => {
        const uniqueCentres = new Set<string>();
        student.classes.forEach((classData: MassClassData) =>
          uniqueCentres.add(classData.centre.name),
        );
        return {
          id: student.id,
          studentId: student.studentId, // eslint-disable-line
          email: student.email,
          name: student.name,
          class1: student.classes.length > 0 ? student.classes[0] : null,
          class2: student.classes.length > 1 ? student.classes[1] : null,
          learningCentre: Array.from(uniqueCentres).join(", "),
          comment: "",
        };
      }),
    );
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  const createStudentsDropdown: DropdownOptionData[] = [
    {
      title: "Bulk Import",
      id: 0,
      onClick: () => {
        setShowBulkImport(true);
      },
    },
    {
      title: "Manual Import",
      id: 1,
      onClick: () => {
        setShowCreateStudents(true);
      },
    },
  ];

  const onTableSelectionChange = (s: GridSelectionModel) => {
    setSelectionIds(s);
    setShowAltControl(s.length > 0);
  };

  const onDeleteSelectionOnClick = () => {
    setToDeleteStudents(
      tableRows.filter((value: StudentRowFormat) =>
        selectionIds.includes(value.id),
      ),
    );
    setShowDeleteStudents(true);
  };

  const onDeleteButtonOnClick = (row: StudentRowFormat) => {
    setToDeleteStudents([row]);
    setShowDeleteStudents(true);
  };

  const onViewStudentOnClick = (row: StudentRowFormat, editNow: boolean) => {
    setToViewStudent(row);
    setEditViewStudentNow(editNow);
    setShowStudentInfo(true);
  };

  const getClassDisplayStr = (classData: MassClassData) => {
    const startTime = dayjs(classData.startTime, "HH:mm:ZZ");
    const endTime = dayjs(classData.endTime, "HH:mm:ZZ");
    return `${NumberToDay[classData.startDay]}, ${startTime.format(
      "h",
    )}-${endTime.format("hA")}`;
  };

  useEffect(() => {
    let filteredRows = tableRows;

    // filter
    filteredRows = filteredRows.filter((student) =>
      student.name.toLowerCase().includes(searchFilter.toLowerCase()),
    ); // filter by search

    filteredRows =
      lcFilter == "all"
        ? filteredRows
        : filteredRows.filter((student) => student.learningCentre == lcFilter); // filter by learning centre dropdown
    filteredRows =
      classDayFilter == "all"
        ? filteredRows
        : filteredRows.filter(
            (
              student, // filter by day of class dropdown
            ) =>
              (student.class1 &&
                NumberToDay[student.class1.startDay]
                  .toLowerCase()
                  .includes(classDayFilter.substring(0, 3).toLowerCase())) ||
              (student.class2 &&
                NumberToDay[student.class2.startDay]
                  .toLowerCase()
                  .includes(classDayFilter.substring(0, 3).toLowerCase())),
          );

    setFilteredTableRows(filteredRows);
  }, [tableRows, lcFilter, searchFilter, classDayFilter]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          className='text-black dark:text-white text-[14px] cursor-pointer'
          onClick={() => onViewStudentOnClick(params.row, false)}
        >
          {params.row.name}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "studentId",
      headerName: "ID",
      width: 100,
    },
    {
      field: "class1",
      headerName: "Class 1",
      width: 150,
      valueFormatter(params) {
        return params.value === null ? "" : getClassDisplayStr(params.value);
      },
    },
    {
      field: "class2",
      headerName: "Class 2",
      width: 150,
      valueFormatter(params) {
        return params.value === null ? "" : getClassDisplayStr(params.value);
      },
    },
    {
      field: "learningCentre",
      headerName: "Learning Centre",
      width: 300,
    },
    {
      field: " ",
      headerName: " ",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className='flex flex-row gap-2 items-center justify-start'>
            <SvgIcon
              className='hover:cursor-pointer'
              component={EyeIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px", cursor: "pointer" }}
              onClick={() => onViewStudentOnClick(params.row, true)}
            />
            <SvgIcon
              className='hover:cursor-pointer'
              component={ThrashIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px", cursor: "pointer" }}
              onClick={() => onDeleteButtonOnClick(params.row)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className='w-full px-4 py-2 flex flex-row justify-between items-center bg-secondaryMain dark:bg-primaryLight-d'>
        <div className='flex flex-row gap-3 items-center'>
          <SearchBar
            className='h-10'
            placeholder='Search'
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchFilter(event.target.value);
            }}
          />
          <AppSelect
            label='Learning Centre'
            value={getColSelectData(tableRows, "learningCentre")[0]}
            data={getColSelectData(tableRows, "learningCentre")}
            onChange={(data: OptionData) => {
              setLcFilter(data.value);
            }}
          />
          <AppButton
            className='rounded-lg bg-transparent border border-[#F4A295] border-opacity-100 text-[#F4A295]'
            variant={ButtonVariant.OUTLINED}
            startIcon={
              <SvgIcon
                component={PlusIcon}
                sx={{ width: "14px" }}
                inheritViewBox
              />
            }
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            More Filters
          </AppButton>
        </div>
        {!showAltControl ? (
          <AppDropdown
            data={createStudentsDropdown}
            title='Create Students'
            className=''
          />
        ) : (
          <div className='flex flex-row gap-2 items-center justify-end'>
            <ThrashIcon
              className='[&>path]:fill-[#f4a295] hover:cursor-pointer'
              onClick={onDeleteSelectionOnClick}
            />
          </div>
        )}
      </div>

      {showMoreFilters && (
        <div
          className='w-full flex flex-row gap-3 items-center px-4 py-3 bg-[#E5E5E5] dark:bg-primaryLight-d'
          style={{ backgroundColor: "#E5E5E5" }}
        >
          <AppSelect
            label='Day of Class'
            value={dayOfClassDropdown[0]}
            data={dayOfClassDropdown}
            onChange={(data: OptionData) => {
              setClassDayFilter(data.value);
            }}
          />
        </div>
      )}

      <Table
        columns={columns}
        rows={filteredTableRows}
        onSelectionChange={onTableSelectionChange}
        showCheckBox
      />
      <BulkImportPopUp
        importTarget={ImportTarget.STUDENT}
        open={showBulkImport}
        onClose={() => {
          getStudentsData();
          setShowBulkImport(false);
        }}
      />
      <CreateStudentsPopUp
        open={showCreateStudents}
        onClose={() => {
          getStudentsData();
          setShowCreateStudents(false);
        }}
      />
      <DeleteStudentsPopUp
        open={showDeleteStudents}
        onClose={() => {
          getStudentsData();
          setShowDeleteStudents(false);
        }}
        toDelete={toDeleteStudents}
        setToDelete={setToDeleteStudents}
      />
      <StudentInfoPopUp
        open={showStudentInfo}
        onClose={() => {
          getStudentsData();
          setShowStudentInfo(false);
        }}
        data={toViewStudent}
        editNow={editViewStudentNow}
      />
    </>
  );
};

export default StudentTab;
