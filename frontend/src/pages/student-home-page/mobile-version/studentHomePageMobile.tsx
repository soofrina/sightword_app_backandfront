import { useEffect, useState } from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { ReactComponent as RightMountain } from "./rightMountain.svg";
import { ReactComponent as LeftMountain } from "./leftMountain.svg";
import OngoingLesson from "@base/pages/student-home-page/mobile-version/ongoing-lesson/ongoingLesson";
import YourClasses from "../your-classes/yourClasses";
import PreviousLessonHandler from "../previous-lesson-handler/previousLessonHandler";
import {
  Lesson,
  PreviousLessonSelectors,
  StudentHomePageProps,
} from "../studentHomePage";
import { studentRoutes } from "@base/constants/routes";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
import MobileHomepage from "../../../assets/MobileHomepage.png";
import { useRecoilValue } from "recoil";
import { userAtom } from "@recoil/user";
import { useQuery } from "@tanstack/react-query";
import {
  getClassesOfStudent,
  militaryTimeToDefaultFormat,
} from "@base/api/classes";
import { ClassDataStudentsTeachers } from "@base/type/dataTypes";
import {
  DateToDateString,
  getDayNameFromDate,
  NumberToDay,
} from "@base/constants/datetime";

type YourClass = {
  content: string;
  location: string;
};

const StudentHomePageMobile = ({
  activeFilter,
  setActiveFilter,
  upcomingLesson,
  pastLessons,
  userName,
  studentId,
  prevLessonFilters,
}: StudentHomePageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);
  const [isHidden, setIsHidden] = useState(false);
  const [mountainRightPosition, setMountainRightPosition] = useState(0.3); // Initial value

  // source of data
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

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newMountainRightPosition = window.innerWidth / 1400; // Adjust denominator as needed
      setMountainRightPosition(newMountainRightPosition);
      const width = window.innerWidth;

      // Hide the mountain if the screen width is greater than 420px
      if (width > 420) {
        setIsHidden(true);
        return;
      }
      setIsHidden(false);
    };

    handleResize(); // Call once initially to set position
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      window.location.reload();
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    if (activeFilter == undefined) {
      setDisplayedPreviousLessons(previousLessons);
    } else {
      const filteredLessons = previousLessons.filter((lesson) => {
        return (
          lesson.day == activeFilter.day &&
          lesson.startTime == activeFilter.startTime &&
          lesson.endTime == activeFilter.endTime
        );
      });
      setDisplayedPreviousLessons(filteredLessons);
    }
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

  const renderContent = () => {
    return (
      <div className='ml-6 z-0'>
        <div className='flex flex-col pt-11'>
          <h1 className='font-bold text-4xl'>Hello,</h1>
          <h1 className='font-bold text-4xl'>{userName}</h1>
        </div>
        <div className='font-bold text-xl mt-5'>UPCOMING LESSON</div>
        <div className='mt-3'>
          <OngoingLesson
            content={upcomingLesson}
            key={upcomingLesson?.id || "no-lesson"}
            onClick={() => {
              toLessonDetails(upcomingLesson?.id || "");
            }}
          />
        </div>
        <div className='font-bold text-xl mt-5 mb-3'>YOUR CLASSES</div>
        <div className='flex flex-col'>
          {classesData.map((yourClass) => {
            // Convert military time to default format
            const startTime = militaryTimeToDefaultFormat(
              yourClass.startTime.slice(0, 5),
            );
            const endTime = militaryTimeToDefaultFormat(
              yourClass.endTime.slice(0, 5),
            );

            // Get the day of the week based on the startDay
            const day = NumberToDay[yourClass.startDay];

            return (
              <YourClasses
                id={yourClass.id}
                day={day}
                timeRange={`${startTime}-${endTime}`}
                key={yourClass.id}
                location={yourClass.centre?.name || "Unknown"}
              />
            );
          })}
          {classesData.length === 0 && (
            <div className='text-center text-lg font-normal'>
              You have no classes yet!
            </div>
          )}
        </div>
        <div className='font-bold text-xl'>PREVIOUS LESSONS</div>
        <div className='font-normal text-lg z-10'>
          Click on the stones to explore each lesson!
        </div>
        <PreviousLessonSelectors
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          prevLessonFilters={prevLessonFilters}
        />
        <div className='flex flex-col items-center mt-3 w-full pr-6'>
          <div className='w-96'>
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
      </div>
    );
  };

  return (
    <>
      {isHidden ? (
        <Box
          className={"w-full pb-20 min-h-screen"}
          style={{
            backgroundImage: `url(${MobileHomepage})`,
            backgroundSize: "cover",
            backgroundPosition: "right bottom",
            backgroundAttachment: "fixed",
          }}
        >
          {renderContent()}
        </Box>
      ) : (
        <Parallax
          pages={5}
          className='bg-gradient-to-b from-primaryMain from-10% to-zinc-50 to-80%'
        >
          {renderContent()}
          <ParallaxLayer
            offset={0.0025}
            className={`z-50 pointer-events-none ${isHidden ? "hidden" : ""}`}
            sticky={{ start: 0.0025, end: 5 }}
          >
            <div className='flex'>
              <ParallaxLayer
                className='z-10'
                horizontal={true}
                offset={0}
                speed={0.3}
              >
                <LeftMountain className='absolute bottom-0' />
              </ParallaxLayer>
              <ParallaxLayer
                className='z-0'
                horizontal={true}
                offset={mountainRightPosition} // Dynamic position
                speed={-0.3}
              >
                <RightMountain className='absolute bottom-0' />
              </ParallaxLayer>
            </div>
          </ParallaxLayer>
          {/* </Box> */}
        </Parallax>
      )}
    </>
  );
};

export default StudentHomePageMobile;
