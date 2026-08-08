import { ChangeEvent, useEffect, useState } from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
} from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import AppSelect from "@base/components/organisation-app-select/AppSelect";
import Table from "../../../components/Table";
import SearchBar from "@base/components/search-bar/searchBar";
import {
  OptionData,
  OptionData as SelectOptionData,
} from "@base/type/appSelect";
import AppDropdown from "@base/components/app-dropdown";
import { OptionData as DropdownOptionData } from "@base/type/appDropdown";
import ViewClassesPopUp from "./viewClassesPopUp";
import DeleteTeachersPopUp from "./deleteTeachersPopUp";
import CreateTeachersPopUp from "@base/components/create-teachers-popup/CreateTeachersPopUp";
import BulkImportPopUp from "@base/components/bulk-import-popup";
import TeacherInfoPopUp from "./teacherInfoPopUp";
import { ImportTarget } from "@base/components/bulk-import-popup/BulkImportPopUp";
import { Role } from "@base/type/user";

import { useRecoilState } from "recoil";
import { userAtom } from "@recoil/user/atom";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as EyeIcon } from "assets/EyeIcon.svg";
import { ReactComponent as ThrashIcon } from "assets/ThrashIcon.svg";

import { MassClassData, TeacherMassData } from "@base/type/dataTypes";
import { getMassTeachers } from "@base/api/teachers";
import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "@base/api/admins";

export type TeacherRowFormat = {
  // temporary types to satisfy typescript requirements
  id: string;
  staffId: string;
  adminId: string | null;
  email: string;
  name: string;
  role: Role;
  learningCentres: string[];
  classes: MassClassData[];
};

const getColSelectData = (
  rows: TeacherRowFormat[],
  col: keyof TeacherRowFormat,
) => {
  // Generates the unique set of learning centres for the filter dropdown
  const options = new Set<string>();
  rows.forEach((row: TeacherRowFormat) => {
    if (row[col] instanceof String) {
      options.add(row[col] as string);
    } else if (row[col] instanceof Array) {
      (row[col] as string[]).forEach((value) => options.add(value));
    }
  });

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
      id: rollingId,
    });
    rollingId++;
  });

  return selectData;
};

const TeacherTab = () => {
  const [showAltControl, setShowAltControl] = useState<boolean>(false);
  const [showTeacherClasses, setShowTeacherClasses] = useState<boolean>(false);
  const [showDeleteTeachers, setShowDeleteTeachers] = useState<boolean>(false);
  const [showBulkImport, setShowBulkImport] = useState<boolean>(false);
  const [showCreateTeachers, setShowCreateTeachers] = useState<boolean>(false);
  const [showTeacherInfo, setShowTeacherInfo] = useState<boolean>(false);

  // Table data
  const [tableRows, setTableRows] = useState<TeacherRowFormat[]>([]);
  const [filteredTableRows, setFilteredTableRows] = useState<
    TeacherRowFormat[]
  >([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [lcFilter, setLcFilter] = useState<string>("all");

  // Pop up data
  const [selectionIds, setSelectionIds] = useState<GridSelectionModel>([]);
  const [toDeleteTeachers, setToDeleteTeachers] = useState<TeacherRowFormat[]>(
    [],
  );
  const [popupTeacherName, setPopupTeacherName] = useState<string>("");
  const [popupTeacherClasses, setPopupTeacherClasses] = useState<
    MassClassData[]
  >([]);
  const [toViewTeacher, setToViewTeacher] = useState<
    TeacherRowFormat | undefined
  >();
  const [editViewTeacherNow, setEditViewTeacherNow] = useState<boolean>(false);

  const [getMassTeachersKey] = useState<string>("getMassTeachers");
  const [getAllAdminsKey] = useState<string>("getAllAdmins");

  const [user] = useRecoilState(userAtom);

  const createTeachersDropdown: DropdownOptionData[] = [
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
        setShowCreateTeachers(true);
      },
    },
  ];

  const onTableSelectionChange = (s: GridSelectionModel) => {
    setSelectionIds(s);
    setShowAltControl(s.length > 0);
  };

  const onDeleteSelectionOnClick = () => {
    setToDeleteTeachers(
      tableRows.filter((value: TeacherRowFormat) =>
        selectionIds.includes(value.id),
      ),
    );
    setShowDeleteTeachers(true);
  };

  const onDeleteButtonOnClick = (row: TeacherRowFormat) => {
    setToDeleteTeachers([row]);
    setShowDeleteTeachers(true);
  };

  const onViewTeacherOnClick = (row: TeacherRowFormat, editNow: boolean) => {
    setToViewTeacher(row);
    setEditViewTeacherNow(editNow);
    setShowTeacherInfo(true);
  };

  useEffect(() => {
    let temp = tableRows;

    // filter
    temp = temp.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchFilter.toLowerCase()),
    ); // filter by search
    temp =
      lcFilter === "all"
        ? temp
        : temp.filter((teacher) => teacher.learningCentres.includes(lcFilter)); // filter by learning

    setFilteredTableRows(temp);
  }, [tableRows, lcFilter, searchFilter]);

  const { data: getAllTeachersData, refetch: refetchTeacherData } = useQuery(
    [getMassTeachersKey],
    () => {
      return getMassTeachers();
    },
  );

  const { data: getAllAdminsData } = useQuery(
    [getAllAdminsKey, getMassTeachersKey],
    () => {
      return getAllAdmins();
    },
    { enabled: !!getAllTeachersData },
  );

  // hot reload on component update
  useEffect(() => {
    refetchTeacherData();
  }, []);

  useEffect(() => {
    if (!getAllTeachersData?.data) return;

    setTableRows(
      getAllTeachersData.data.map((teacher: TeacherMassData) => {
        const uniqueCentres = new Set<string>();
        teacher.classes.forEach((classData: MassClassData) =>
          uniqueCentres.add(classData.centre.name),
        );

        return {
          id: teacher.id,
          staffId: teacher.staffId,
          adminId: null,
          email: teacher.email,
          name: teacher.name,
          role:
            getAllAdminsData?.data &&
            getAllAdminsData.data.filter(
              (adminData) => adminData.email === teacher.email,
            ).length > 0
              ? "admin"
              : "teacher",
          learningCentres: Array.from(uniqueCentres),
          classes: teacher.classes,
        };
      }),
    );
  }, [getAllTeachersData]);

  useEffect(() => {
    if (!getAllAdminsData?.data) return;

    setTableRows(
      tableRows.map((row) => {
        getAllAdminsData.data.forEach((adminData) => {
          if (adminData.email === row.email) {
            row.role = "admin";
            row.adminId = adminData.id;
          }
        });

        return row;
      }),
    );
  }, [getAllAdminsData]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          className='text-black dark:text-white text-[14px] cursor-pointer'
          onClick={() => onViewTeacherOnClick(params.row, false)}
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
      field: "role",
      headerName: "Role",
      width: 100,
    },
    {
      field: "learningCentres",
      headerName: "Learning Centre",
      width: 160,
      valueFormatter(params) {
        return params.value === undefined ? "" : params.value.join(", ");
      },
    },
    {
      field: "classes",
      headerName: "Classes",
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Typography
            sx={{
              textDecoration: "underline",
              color: "#18289C",
              cursor: "pointer",
            }}
            onClick={() => {
              setPopupTeacherClasses(params.row.classes);
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
      field: " ",
      headerName: " ",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div className='flex flex-row gap-2 items-center justify-start'>
            <SvgIcon
              component={EyeIcon}
              viewBox='0 0 24 24'
              sx={{ width: "24px", cursor: "pointer" }}
              onClick={() => onViewTeacherOnClick(params.row, true)}
            />
            <SvgIcon
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
            value={getColSelectData(tableRows, "learningCentres")[0]}
            data={getColSelectData(tableRows, "learningCentres")}
            onChange={(data: OptionData) => {
              setLcFilter(data.value);
            }}
          />
        </div>
        {!showAltControl ? (
          <AppDropdown
            data={createTeachersDropdown}
            title='Add Teachers'
            className=''
          />
        ) : (
          <SvgIcon
            component={ThrashIcon}
            viewBox='0 0 24 24'
            sx={{ width: "24px", cursor: "pointer" }}
            onClick={onDeleteSelectionOnClick}
          />
        )}
      </div>
      <Table
        columns={columns}
        rows={filteredTableRows}
        onSelectionChange={onTableSelectionChange}
        showCheckBox
      />
      <ViewClassesPopUp
        open={showTeacherClasses}
        onClose={() => {
          setShowTeacherClasses(false);
        }}
        teacherName={popupTeacherName}
        classesData={popupTeacherClasses}
      />
      <DeleteTeachersPopUp
        open={showDeleteTeachers}
        onClose={() => {
          setShowDeleteTeachers(false);
          refetchTeacherData();
        }}
        toDelete={toDeleteTeachers}
        setToDelete={setToDeleteTeachers}
      />
      <CreateTeachersPopUp
        open={showCreateTeachers}
        onClose={() => {
          refetchTeacherData();
          setShowCreateTeachers(false);
        }}
      />
      <BulkImportPopUp
        importTarget={ImportTarget.TEACHER}
        open={showBulkImport}
        onClose={() => {
          refetchTeacherData();
          setShowBulkImport(false);
        }}
      />
      <TeacherInfoPopUp
        open={showTeacherInfo}
        onClose={() => {
          refetchTeacherData();
          setShowTeacherInfo(false);
        }}
        data={toViewTeacher}
        editNow={editViewTeacherNow}
      />
    </>
  );
};

export default TeacherTab;
