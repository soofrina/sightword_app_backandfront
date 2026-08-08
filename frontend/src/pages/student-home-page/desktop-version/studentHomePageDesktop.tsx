import { useEffect, useState } from "react";
import OngoingLesson from "@base/pages/student-home-page/desktop-version/ongoing-lesson/ongoingLesson";
import PreviousLessonHandler from "../previous-lesson-handler/previousLessonHandler";
import YourClassesBox from "./your-classes-box/yourClassesBox";
import PreviousLessonSelector from "../prevLesson-filter/prevLessonFilter";
import DesktopHomepage from "../../../assets/DesktopHomepage.png";

import {
  Lesson,
  PrevLessonFilter,
  PreviousLessonSelectors,
  StudentHomePageProps,
  YourClass,
} from "../studentHomePage";
import { useNavigate } from "react-router";
import { studentRoutes } from "@base/constants/routes";
import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userAtom } from "@recoil/user";
import { useQuery } from "@tanstack/react-query";
import { getClassesOfStudent } from "@base/api/classes";
import { ClassDataStudentsTeachers, LessonData } from "@base/type/dataTypes";
import { getLessonsByStudentId } from "@base/api/lessons";
import { DateToDateString, getDayNameFromDate } from "@base/constants/datetime";

const StudentHomePageDesktop = ({
  activeFilter,
  setActiveFilter,
  upcomingLesson,
  pastLessons,
  userName,
  studentId,
  prevLessonFilters,
}: StudentHomePageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOffsetY] = useState<number>(0);

  // source of data

  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [previousLessons, setPreviousLessons] = useState<Lesson[]>([]);
  const [displayedPreviousLessons, setDisplayedPreviousLessons] = useState<
    Lesson[]
  >([]);

  useEffect(() => {
    const updatedLessons: Lesson[] = pastLessons.map((lesson) => {
      const day = getDayNameFromDate(lesson.startDate);
      const startTime = new Date(lesson.startDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const endTime = new Date(lesson.endDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const date = DateToDateString(lesson.startDate);

      return {
        id: lesson.id,
        date,
        day,
        startTime,
        endTime,
      };
    });

    setPreviousLessons(updatedLessons);
    setDisplayedPreviousLessons(updatedLessons);
  }, [pastLessons]);

  useEffect(() => {
    if (!activeFilter) {
      setDisplayedPreviousLessons(previousLessons);
      return;
    }

    const filteredLessons = previousLessons.filter(
      (lesson) =>
        lesson.day === activeFilter.day &&
        lesson.startTime === activeFilter.startTime &&
        lesson.endTime === activeFilter.endTime,
    );

    setDisplayedPreviousLessons(filteredLessons);
  }, [activeFilter, previousLessons]);

  const navigate = useNavigate();
  const toLessonDetails = (id: string) => {
    navigate(`${studentRoutes.lessonDetails}/${id}`);
  };

  /// ADDING LOGIC FOR API CALLS
  const { data: studentClasses } = useQuery({
    queryKey: ["getClassesOfStudent"],
    queryFn: () => (studentId ? getClassesOfStudent(studentId) : null),
  });
  const classesData: ClassDataStudentsTeachers[] = studentClasses
    ? studentClasses.data.filter(
        (classItem: ClassDataStudentsTeachers) => classItem.isActive,
      )
    : [];

  return (
    <Box
      className='w-full pb-8 min-h-screen'
      style={{
        backgroundImage: `url(${DesktopHomepage})`,
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backgroundAttachment: "fixed",
      }}
    >
      <div className='ml-6 z-0'>
        <div className='flex flex-col pt-11'>
          <h1 className='font-bold text-4xl'>Welcome, {userName}</h1>
        </div>
        <div className='flex flex-row mt-10 gap-3'>
          <OngoingLesson
            content={upcomingLesson}
            key={upcomingLesson?.id || "no-lesson"}
            onClick={() => {
              toLessonDetails(upcomingLesson?.id || "");
            }}
          />
          <div>
            <YourClassesBox classes={classesData || []} />
          </div>
        </div>
        <div className='ml-16 mt-11'>
          <div className='font-bold text-xl'>PREVIOUS LESSONS</div>
          <div className='font-normal text-lg z-10'>
            Click on the stones to explore each lesson!
          </div>
          <PreviousLessonSelectors
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            prevLessonFilters={prevLessonFilters}
          />
        </div>
        <div className='mt-9 w-96 ml-80'>
          {displayedPreviousLessons.map((lesson, idx) => (
            <PreviousLessonHandler
              id={lesson.id.toString()}
              key={lesson.id}
              date={lesson.date}
              day={lesson.day}
              startTime={lesson.startTime}
              endTime={lesson.endTime}
              side={idx % 2}
              isLast={idx + 1 == displayedPreviousLessons.length}
            />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default StudentHomePageDesktop;
