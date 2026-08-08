import { useEffect, useState } from "react";
import StudentHomePageMobile from "./mobile-version/studentHomePageMobile";
import StudentHomePageDesktop from "./desktop-version/studentHomePageDesktop";
import PreviousLessonSelector from "./prevLesson-filter/prevLessonFilter";
import { LessonData } from "@base/type/dataTypes";
import { useQuery } from "@tanstack/react-query";
import { getLessonsByStudentId } from "@base/api/lessons";
import { useRecoilValue } from "recoil";
import { userAtom } from "@recoil/user";

export type Lesson = {
  id: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
};

export type YourClass = {
  content: string;
  location: string;
};

export type PrevLessonFilter = {
  day: string;
  startTime: string;
  endTime: string;
};

type PreviousLessonSelectorsProps = {
  activeFilter: PrevLessonFilter | undefined;
  setActiveFilter: (filter: PrevLessonFilter | undefined) => void;
  prevLessonFilters: PrevLessonFilter[];
};

const generateUniqueFilters = (lessons: LessonData[]): PrevLessonFilter[] => {
  const uniqueFilters: { [key: string]: PrevLessonFilter } = {};

  lessons.forEach((lesson) => {
    const lessonDay = new Date(lesson.startDate).toLocaleString("en-US", {
      weekday: "long",
    });
    const lessonStartTime = new Date(lesson.startDate).toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit", hour12: true },
    );
    const lessonEndTime = new Date(lesson.endDate).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const filterKey = `${lessonDay}_${lessonStartTime}_${lessonEndTime}`;

    if (!uniqueFilters[filterKey]) {
      uniqueFilters[filterKey] = {
        day: lessonDay,
        startTime: lessonStartTime,
        endTime: lessonEndTime,
      };
    }
  });

  return Object.values(uniqueFilters);
};

export const PreviousLessonSelectors = ({
  activeFilter,
  setActiveFilter,
  prevLessonFilters,
}: PreviousLessonSelectorsProps) => {
  const handleButtonClick = (filter: PrevLessonFilter | undefined) => {
    setActiveFilter(filter);
  };

  const convertFilterToString = (filter: PrevLessonFilter | undefined) => {
    if (!filter) {
      return "";
    }

    return `${filter.day} ${filter.startTime}-${filter.endTime}`;
  };

  return (
    <div className='flex flex-row w-full overflow-x-auto'>
      <div className='flex-shrink-0'>
        <PreviousLessonSelector
          content='All'
          isPressed={activeFilter === undefined}
          onClick={() => handleButtonClick(undefined)}
        />
      </div>
      {prevLessonFilters.map((prevLessonFilter) => {
        const filterStr = convertFilterToString(prevLessonFilter);
        return (
          <div className='flex-shrink-0' key={filterStr}>
            <PreviousLessonSelector
              content={filterStr}
              key={filterStr}
              isPressed={
                convertFilterToString(activeFilter) ===
                convertFilterToString(prevLessonFilter)
              }
              onClick={() => handleButtonClick(prevLessonFilter)}
            />
          </div>
        );
      })}
    </div>
  );
};

export type StudentHomePageProps = {
  activeFilter: PrevLessonFilter | undefined;
  setActiveFilter: (filter: PrevLessonFilter | undefined) => void;
  upcomingLesson: LessonData | null;
  pastLessons: LessonData[];
  userName: string;
  studentId: string;
  prevLessonFilters: PrevLessonFilter[];
};

const StudentHomePage = () => {
  const [activeFilter, setActiveFilter] = useState<
    PrevLessonFilter | undefined
  >(undefined);
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 1145;

  const user = useRecoilValue(userAtom);
  const getUserName = () => {
    // priority of teacher, student, admin
    let roleName = user.roleNames.find((e) => e.role === "teacher");
    if (roleName && roleName.name) {
      return roleName.name;
    }
    roleName = user.roleNames.find((e) => e.role === "student");
    if (roleName && roleName.name) {
      return roleName.name;
    }

    return "Admin";
  };

  const getStudentId = () => {
    const roleName = user.roleNames.find((e) => e.role === "student");
    if (roleName && roleName.role_id) {
      return roleName.role_id;
    }
    return "";
  };

  const { data: studentLessonsData } = useQuery({
    queryKey: ["getLessonsByStudentId"],
    queryFn: () =>
      getStudentId() ? getLessonsByStudentId(getStudentId()) : null,
  });
  const studentLessons: LessonData[] = studentLessonsData
    ? studentLessonsData.data
    : [];

  const [upcomingLesson, setUpcomingLesson] = useState<LessonData | null>(null);
  const [pastLessons, setPastLessons] = useState<LessonData[]>([]);

  useEffect(() => {
    const now = new Date();

    // Sort the lessons by ascending order of startDate
    const sortedLessons = [...studentLessons].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    let foundUpcoming = false;
    const pastLessonsLocal: LessonData[] = [];

    for (const lesson of sortedLessons) {
      const lessonStartDate = new Date(lesson.startDate);

      // Finding the earliest upcoming lesson
      if (lessonStartDate > now && !foundUpcoming) {
        setUpcomingLesson(lesson);
        foundUpcoming = true;
      } else if (lessonStartDate <= now) {
        pastLessonsLocal.push(lesson);
      }
    }

    setPastLessons(pastLessonsLocal);
  }, [studentLessons]);

  const [uniquePrevLessonFilters, setUniquePrevLessonFilters] = useState<
    PrevLessonFilter[]
  >([]);

  useEffect(() => {
    const uniqueFilters = generateUniqueFilters(pastLessons);
    setUniquePrevLessonFilters(uniqueFilters);
  }, [pastLessons]);

  return (
    <>
      {isMobile ? (
        <StudentHomePageMobile
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          upcomingLesson={upcomingLesson}
          pastLessons={pastLessons}
          userName={getUserName()}
          studentId={getStudentId()}
          prevLessonFilters={uniquePrevLessonFilters}
        />
      ) : (
        <StudentHomePageDesktop
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          upcomingLesson={upcomingLesson}
          pastLessons={pastLessons}
          userName={getUserName()}
          studentId={getStudentId()}
          prevLessonFilters={uniquePrevLessonFilters}
        />
      )}
    </>
  );
};

export default StudentHomePage;
