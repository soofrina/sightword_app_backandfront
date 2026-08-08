import BoxWithHeader from "./BoxWithHeader";
import { ChevronLeft, Close, Logout } from "@mui/icons-material";
import DetailsList, { Detail } from "./DetailsList";
import React, { useEffect, useState } from "react";
import LightDark from "./LightDark";
import { Avatar, Button, useMediaQuery, useTheme } from "@mui/material";
import { getAvatar } from "@base/utility/common";
import { userAtom } from "@recoil/user";
import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  getClassesOfStudent,
  militaryTimeToDefaultFormat,
} from "@base/api/classes";
import { useQuery } from "@tanstack/react-query";
import { NumberToDay, getDayNumericValue } from "@base/constants/datetime";
import { getStudentById } from "@base/api/students";

const StudentSettingsPage = () => {
  const user = useRecoilValue(userAtom);
  const [classes, setClasses] = useState<Detail[]>([]);
  const [stuId, setStuId] = useState<string>("");

  const [previousClasses, setPreviousClasses] = useState<Detail[]>([]);
  const [personalInformation, setPersonalInformation] = useState<Detail[]>([]);
  const logoutUser = useResetRecoilState(userAtom);
  const getStudentId = () => {
    const roleName = user.roleNames.find((e) => e.role === "student");
    if (roleName && roleName.role_id) {
      return roleName.role_id;
    }
    return "";
  };

  const { data } = useQuery({
    queryKey: ["getStudentClasses", getStudentId()],
    queryFn: () => getClassesOfStudent(getStudentId()),
  });

  useEffect(() => {
    if (data?.data) {
      setClasses(
        data?.data
          .filter((c) => c.isActive)
          .map((c) => {
            const classKey = `${
              NumberToDay[c.startDay]
            }, ${militaryTimeToDefaultFormat(
              c.startTime,
            )}-${militaryTimeToDefaultFormat(c.endTime)}`;
            return {
              id: c.id,
              key: classKey,
              value: c.centre.name,
            };
          }),
      );

      setPreviousClasses(
        data?.data
          .filter((c) => !c.isActive)
          .map((c) => {
            const classKey = `${
              NumberToDay[c.startDay]
            }, ${militaryTimeToDefaultFormat(
              c.startTime,
            )}-${militaryTimeToDefaultFormat(c.endTime)}`;
            return {
              id: c.id,
              key: classKey,
              value: c.centre.name,
            };
          }),
      );
    }
  }, [data?.data]);

  const { data: studentData } = useQuery({
    queryKey: ["getStudentbyId", getStudentId()],
    queryFn: () => getStudentById(getStudentId()),
  });

  useEffect(() => {
    if (studentData?.data) {
      setStuId(studentData.data.studentId);
    }
  }, [studentData?.data]);

  useEffect(() => {
    setPersonalInformation([
      {
        id: "",
        key: "Name",
        value: getUserName(),
      },
      {
        id: "",
        key: "ID",
        value: stuId || "Student ID not found",
      },
      {
        id: "",
        key: "Email",
        value: user.email,
      },
    ]);
  }, [user]);

  const [showPrevious, setShowPrevious] = useState(false);

  const ViewPreviousHeader = () => {
    return (
      <p
        onClick={() => setShowPrevious(true)}
        className='text-textSecondary cursor-pointer text-sm font-normal'
      >
        View Previous Classes
      </p>
    );
  };

  interface PreviousClassesProps {
    classes: Detail[];
  }

  const PreviousClasses = ({ classes }: PreviousClassesProps) => {
    return (
      <BoxWithHeader
        header={"Previous Classes"}
        headerAction={
          <Close
            className='cursor-pointer'
            onClick={() => setShowPrevious(false)}
          />
        }
      >
        <DetailsList short details={classes} />
      </BoxWithHeader>
    );
  };

  const PreviousClassesMobile = ({ classes }: PreviousClassesProps) => {
    return (
      <div className='rounded max-w-[400px] my-4 w-full'>
        <div className='bg-overlayMain dark:bg-primaryLight-d font-bold rounded-t py-2 px-6 flex drop-shadow-md'>
          <p className='w-1/3'>ID</p>
          <p className='w-1/3'>Class</p>
          <p className='w-1/3'>Centre</p>
        </div>
        {classes.map((c, idx) => {
          return (
            <div
              key={`${idx}-${c.id}-${c.key}-${c.value}`}
              className='flex px-6 py-4 bg-overlayMain dark:bg-overlayMain-d'
            >
              <div className='w-1/3'>{c.id}</div>
              <div className='w-1/3'>{c.key}</div>
              <div className='w-1/3'>{c.value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getUserName = () => {
    const role = "student";
    const roleName = user.roleNames.find((e) => e.role === role);
    if (roleName && roleName.name) {
      return roleName.name;
    }
    if (user.roleNames.some((e) => e.role === "admin")) {
      return "Admin";
    }
    // Should never reach here, all roles should have name other than Admin
    return "Student";
  };

  return (
    <div className='bg-gradient-to-b from-primaryMain from-10% to-zinc-50 to-80% dark:from-textPrimary dark:to-secondaryMainHover dark:to-100% min-h-screen w-full pb-16'>
      {((isMobile && !showPrevious) || !isMobile) && (
        <div className='mx-4 pt-5'>
          <p className='text-3xl font-bold mb-4'>Settings</p>
          {!isMobile && (
            <div className='mb-4 flex'>
              <Avatar className='w-48 h-48' src={getAvatar(getUserName())} />
              <div className='flex flex-col justify-center ml-4'>
                <p className='font-bold text-3xl mb-2'>{getUserName()}</p>
                <p>{user.email}</p>
              </div>
            </div>
          )}
          <div>
            <BoxWithHeader header={"Personal Information"}>
              <DetailsList details={personalInformation} />
            </BoxWithHeader>
            {!isMobile && showPrevious && (
              <div className='absolute left-[700px] w-[400px]'>
                <PreviousClasses classes={previousClasses} />
              </div>
            )}
          </div>
          <BoxWithHeader
            header={"My Classes"}
            headerAction={<ViewPreviousHeader />}
          >
            <DetailsList details={classes} />
          </BoxWithHeader>
          {/* <BoxWithHeader header={"Display"}>
            <LightDark />
          </BoxWithHeader> */}
          <Button
            className='bg-commonWhite dark:bg-primaryLight-d text-primaryMain dark:text-commonWhite hover:bg-primaryMain hover:text-commonWhite w-full max-w-[400px]'
            variant='contained'
            onClick={logoutUser}
          >
            <div className='flex items-center justify-start w-full'>
              <Logout />
              <p className='ml-4 text-left'>Logout</p>
            </div>
          </Button>
        </div>
      )}
      {isMobile && showPrevious && (
        <div className='flex flex-col items-center'>
          <div className='bg-commonWhite dark:bg-primaryLight-d h-20 flex justify-center items-center drop-shadow-md w-full'>
            <ChevronLeft
              className='absolute left-4 cursor-pointer'
              onClick={() => setShowPrevious(false)}
            />
            <p className='font-bold'>Previous Classes</p>
          </div>
          <PreviousClassesMobile classes={previousClasses} />
        </div>
      )}
    </div>
  );
};

export default StudentSettingsPage;
