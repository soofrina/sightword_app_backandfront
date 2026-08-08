import StudentOngoingClassPageDesktop from "./desktop-version/studentOngoingClassPageDesktop";
import StudentOngoingClassPageMobile from "./mobile-version/studentOngoingClassPageMobile";
import { useEffect, useState } from "react";
import { LessonData, LessonWordData } from "@base/type/dataTypes";
import { useNavigate, useParams } from "react-router";
import {
  getLessonsByLessonId,
  getLessonWordsByLessonIdAndStudentId,
} from "@base/api/lessons";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userAtom } from "@recoil/user";
import {
  DateToFullDateString,
  getDayNameFromDate,
  getTimeFromDate,
} from "@base/constants/datetime";
import { studentRoutes } from "@base/constants/routes";

const StudentOngoingClassPage = () => {
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
  const getStudentId = () => {
    const roleName = user.roleNames.find((e) => e.role === "student");
    if (roleName && roleName.role_id) {
      return roleName.role_id;
    }
    return "";
  };

  const { id } = useParams();
  const lessonId = id ?? ""; // Providing a default empty string value

  const { data: wordsToLearnData } = useQuery(
    ["lessonWords", lessonId, getStudentId()],
    () => getLessonWordsByLessonIdAndStudentId(lessonId, getStudentId()),
    { retry: 3 },
  );

  const wordsToLearn: LessonWordData[] = wordsToLearnData
    ? wordsToLearnData.data
    : [];

  const { data: lessonDetailsData } = useQuery(
    ["lessonDetails", lessonId],
    () => getLessonsByLessonId(lessonId),
    { retry: 3 },
  );

  const lessonDetails: LessonData | null = lessonDetailsData
    ? lessonDetailsData.data
    : null;

  const wordJourneys = [
    ...wordsToLearn.map((wordData) => wordData.word.word),
    "Quiz",
    "End",
  ];

  const getDayTimeRange = () => {
    if (lessonDetails === null) {
      return "";
    }

    const startTime = getTimeFromDate(lessonDetails.startDate);
    const endTime = getTimeFromDate(lessonDetails.endDate);
    const day = getDayNameFromDate(lessonDetails.startDate);
    return `${day}, ${startTime} - ${endTime}`;
  };

  const getDate = () => {
    if (lessonDetails === null) {
      return "";
    }
    return DateToFullDateString(lessonDetails.startDate);
  };

  const navigate = useNavigate();

  const latestWordAttempts = () =>
    wordsToLearn
      .filter((w) => w.attempts.length > 0)
      .map((wordData) => {
        const sortedAttempts = [...wordData.attempts].sort(
          (a, b) =>
            new Date(b.attemptedAt).getTime() -
            new Date(a.attemptedAt).getTime(),
        );
        return sortedAttempts[0]; // Return the latest attempt
      });

  const navigateToLesson = () => {
    navigate(
      `${studentRoutes.lessonLearningJourney.replace(":lessonId", lessonId)}`,
    );
  };

  return (
    <div>
      {isMobile ? (
        <StudentOngoingClassPageMobile
          day={getDayTimeRange()}
          date={getDate()}
          wordJourneys={wordJourneys}
          wordsToLearn={wordsToLearn.map((wordData) => wordData.word.word)}
          attemptData={latestWordAttempts()}
          goToLesson={navigateToLesson}
        />
      ) : (
        <StudentOngoingClassPageDesktop
          day={getDayTimeRange()}
          date={getDate()}
          wordJourneys={wordJourneys}
          wordsToLearn={wordsToLearn.map((wordData) => wordData.word.word)}
          attemptData={latestWordAttempts()}
          goToLesson={navigateToLesson}
        />
      )}
    </div>
  );
};

export default StudentOngoingClassPage;
