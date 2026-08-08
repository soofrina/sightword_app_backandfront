import RecoilTest from "@components/recoil-test";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PageTitle from "@components/page-title";
import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import EditClassPopUp from "@components/edit-class-details-popup/EditClassPopUp";
import AddStudentPopUp from "@components/add-student-popup/AddStudentPopUp";
import { useSearchParams, useMatch } from "react-router-dom";
import AddTeacherPopUp from "@components/add-teacher-popup";
import LessonPlan from "../lesson-plan";
import { useQuery } from "@tanstack/react-query";
import { getClassById } from "@base/api/classes";
import { staffRoutes } from "@base/constants/routes";
import { Class } from "@base/type/dataTypes";
import { caps, getTimeText } from "@base/utility/common";
import { dayNumToString } from "@utility/dates";
import dayjs from "dayjs";
import { StudentTab } from "@pages/class-page/student-tab/studentTab";
import { TeacherTab } from "@pages/class-page/teacher-tab/teacherTab";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ThrashIcon } from "@assets/ThrashIcon.svg";
import DeleteClassPopUp from "@components/delete-class-popup";

const TAB_URL_PARAM = "page";

interface iconOnClickProps {
  handleEditClass: () => void;
  className?: string;
}
const OrangePencilIcon = ({
  handleEditClass,
  className = "",
}: iconOnClickProps) => (
  <svg
    className={className}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    onClick={handleEditClass}
  >
    <path
      d='M3 17.2505V21.0005H6.75L17.81 9.94049L14.06 6.19049L3 17.2505ZM20.71 7.04049C20.8027 6.94798 20.8763 6.83809 20.9264 6.71712C20.9766 6.59614 21.0024 6.46646 21.0024 6.33549C21.0024 6.20452 20.9766 6.07484 20.9264 5.95387C20.8763 5.83289 20.8027 5.723 20.71 5.63049L18.37 3.29049C18.2775 3.19779 18.1676 3.12424 18.0466 3.07406C17.9257 3.02388 17.796 2.99805 17.665 2.99805C17.534 2.99805 17.4043 3.02388 17.2834 3.07406C17.1624 3.12424 17.0525 3.19779 16.96 3.29049L15.13 5.12049L18.88 8.87049L20.71 7.04049V7.04049Z'
      fill='#F4A295'
    />
  </svg>
);

export type Student = {
  name: string;
  email: string;
  id: string;
  lastAttempted: string;
  status: string;
};

export type Teacher = {
  name: string;
  email: string;
  id: string;
  role: string;
  learningCentre: string;
  status: string;
};

type Tab = "Overview" | "Students" | "Teachers" | "Lessons";

interface TabPanelProps {
  children?: React.ReactNode;
  tab: Tab;
  value: string;
  padding?: number;
}

function isOfTypeTab(tab: string): tab is Tab {
  return ["Overview", "Students", "Teachers", "Lessons"].includes(tab);
}

const viewClassPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  let tab = searchParams.get(TAB_URL_PARAM);
  tab = !!tab && isOfTypeTab(tab) ? tab : "Overview";
  const [tabValue, setTabValue] = useState<string>(tab);
  const [isEditClassModalOpen, setIsEditClassModalOpen] =
    useState<boolean>(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] =
    useState<boolean>(false);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] =
    useState<boolean>(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] =
    useState<boolean>(false);

  // data queries & state related to data queries
  const [isFetchingClass, setIsFetchingClass] = useState(true);
  const [classData, setClassData] = useState<Class>();
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // obtain classId from url params
  const match = useMatch(`${staffRoutes.viewClass}/:classId`);
  const classId = match?.params?.classId ?? "";

  // called when students get added
  const didAddStudents = () => {
    setIsAddStudentModalOpen(false);
    // retrieve new students after adding student
    setIsFetchingClass(true);
  };

  const didAddTeacher = () => {
    setIsAddTeacherModalOpen(false);
    // retrieve new teachers after adding teacher
    setIsFetchingClass(true);
  };

  const getClassDetails = useQuery({
    enabled: isFetchingClass,
    queryKey: ["getClasses"],
    retry: 5,
    queryFn: () => getClassById(classId),
  });

  useEffect(() => {
    setIsFetchingClass(true);
  }, [classId]);

  useEffect(() => {
    if (getClassDetails.data) {
      const classData = getClassDetails.data.data;
      const newClass: Class = {
        id: classData.id,
        day: dayNumToString(classData?.startDay),
        startTime: dayjs(classData.startTime, "HH:mm:ssZ"),
        endTime: dayjs(classData.endTime, "HH:mm:ssZ"),
        learningCentre: classData?.centre?.name ?? "",
        teachers: classData.teachers ?? [],
        students: classData.students ?? [],
      };
      setIsFetchingClass(false);
      setClassData(newClass);
    }
  }, [getClassDetails.data]);

  useEffect(() => {
    setStudents(
      classData?.students.map((s) => {
        const student: Student = {
          id: s.id,
          name: s.name,
          email: s.email,
          // TODO: Update this
          lastAttempted: Date.now().toString(),
          status: "Active",
        };
        return student;
      }) ?? [],
    );
  }, [classData?.students]);

  useEffect(() => {
    setTeachers(
      classData?.teachers.map((t) => {
        const teacher: Teacher = {
          id: t.id,
          name: t.name,
          email: t.email,
          // TODO: Update this
          status: "Active",
          role: "teacher",
          learningCentre: classData.learningCentre,
        };
        return teacher;
      }) ?? [],
    );
  }, [classData?.teachers]);

  function TabPanel(props: TabPanelProps) {
    const { children, value, tab, padding, ...other } = props;

    return (
      <div
        role='tabpanel'
        hidden={value !== tab}
        id={`simple-tabpanel-${tab}`}
        aria-labelledby={`simple-tab-${tab}`}
        {...other}
      >
        {value === tab && (
          <Box sx={{ p: padding == undefined ? 4 : padding }}>
            <Typography component={"span"}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const handleChange = (event: SyntheticEvent, newValue: Tab) => {
    setSearchParams(
      (searchParams) => {
        searchParams.set(TAB_URL_PARAM, newValue);
        return searchParams;
      },
      { replace: true },
    );
    setTabValue(newValue);
  };

  const handleEditClass = () => {
    setIsFetchingClass(true);
    setIsEditClassModalOpen(false);
  };

  const day = classData?.day;
  const startTime = getTimeText(classData?.startTime || dayjs(0));
  const endTime = getTimeText(classData?.endTime || dayjs(0));
  const learningCentre = classData?.learningCentre;

  return (
    <div className='flex flex-grow flex-col overflow-y-auto'>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetchingClass}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <DeleteClassPopUp
        open={isDeleteClassModalOpen}
        onClose={() => setIsDeleteClassModalOpen(false)}
        classId={classId}
        day={day || ""}
        time={`${startTime} - ${endTime}`}
      />
      <EditClassPopUp
        currentClass={classData}
        handleEditClass={handleEditClass}
        popUpTitle='Edit Class Details'
        open={isEditClassModalOpen}
        onClose={() => setIsEditClassModalOpen(false)}
      />
      <AddStudentPopUp
        currentClass={classData}
        popUpTitle={`Add Student(s) to: ${day} ${startTime}-${endTime}`}
        open={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        didAddStudents={didAddStudents}
      />
      <AddTeacherPopUp
        currentClass={classData}
        popUpTitle={`Add Teacher(s) to: ${day} ${startTime}-${endTime}`}
        open={isAddTeacherModalOpen}
        onClose={() => setIsAddTeacherModalOpen(false)}
        didAddTeacher={didAddTeacher}
      />
      {!isFetchingClass && (
        <PageTitle title={`${day && caps(day)} ${startTime}-${endTime}`} />
      )}
      <div className='flex flex-col w-11/12 self-center mt-20'>
        <AppBar
          className='self-center z-10 bg-primaryLight dark:bg-primaryLight-d'
          position='static'
        >
          <Tabs
            value={tabValue}
            onChange={handleChange}
            textColor='primary'
            indicatorColor='primary'
          >
            <Tab value='Overview' label='Class Overview' />
            <Tab value='Students' label='Students' />
            <Tab value='Teachers' label='Teachers' />
            <Tab value='Lessons' label='Lesson Plans' />
          </Tabs>
        </AppBar>
        <div className='bg-primaryLight dark:bg-primaryLight-d'>
          <TabPanel value={tabValue} tab='Overview'>
            <div className='flex justify-between'>
              <p className='text-textSecondary dark:text-textSecondary-d mb-4'>
                Class Details
              </p>
              <div className='flex items-center'>
                <OrangePencilIcon
                  className='cursor-pointer'
                  handleEditClass={() => setIsEditClassModalOpen(true)}
                />
                <SvgIcon
                  className='cursor-pointer'
                  component={ThrashIcon}
                  viewBox='0 0 24 24'
                  sx={{ width: "24px" }}
                  onClick={() => {
                    setIsDeleteClassModalOpen(true);
                  }}
                />
              </div>
            </div>
            {!isFetchingClass && (
              <ul>
                <li>
                  <p className='text-textPrimary dark:text-textPrimary-d'>
                    <span className='font-bold'>Day: </span>
                    {day}
                  </p>
                </li>
                <li>
                  <p className='text-textPrimary dark:text-textPrimary-d'>
                    <span className='font-bold'>Time: </span>
                    {`${startTime}-${endTime}`}
                  </p>
                </li>
                <li>
                  <p className='text-textPrimary dark:text-textPrimary-d'>
                    <span className='font-bold'>Learning Centre: </span>
                    {learningCentre}
                  </p>
                </li>
              </ul>
            )}
          </TabPanel>
          <TabPanel value={tabValue} padding={0} tab='Students'>
            <StudentTab
              setIsFetchingClass={setIsFetchingClass}
              students={students}
              setIsAddStudentModalOpen={setIsAddStudentModalOpen}
              classId={classId}
            />
          </TabPanel>
          <TabPanel value={tabValue} padding={0} tab='Teachers'>
            <TeacherTab
              teachers={teachers}
              setIsAddTeacherModalOpen={setIsAddTeacherModalOpen}
            />
          </TabPanel>
          <TabPanel value={tabValue} tab='Lessons'>
            <LessonPlan currentClass={classData} />
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default viewClassPage;
