import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import AppButton from "@base/components/app-button/appButton";
import React, { useEffect, useState, useMemo } from "react";
import OngoingClassHeader from "../student-ongoing-class-page/ongoingClassHeader";
import ClassWordsTable from "@base/components/class-words/ClassWordsTable";
import MobileBackground from "@assets/ClassWordsMobile.png";
import DesktopBackground from "@assets/ClassWordsDesktop.png";
import { useParams } from "react-router-dom";
import {
  getLessonsByClassId,
  getLessonWordsByLessonId,
} from "@base/api/lessons";
import {
  ClassDataStudentsTeachers,
  LessonWordData,
} from "@base/type/dataTypes";
import { DifficultyLevel } from "@base/type/wordBank";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getClassById, militaryTimeToDefaultFormat } from "@base/api/classes";
import { DateToDateString, NumberToDay } from "@base/constants/datetime";

const ClassWordsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { id } = useParams();
  const fetchLessons = () => getLessonsByClassId(id || "");
  const fetchLessonWords = (lessonId: string) =>
    getLessonWordsByLessonId(lessonId);

  const lessonsQuery = useQuery(["lessons", id], fetchLessons);

  const lessonWordsQueries = useQueries({
    queries:
      lessonsQuery.data?.data.map((lesson) => ({
        queryKey: ["lessonWords", lesson.id],
        queryFn: () => fetchLessonWords(lesson.id),
      })) || [],
  });

  const lessonWords = useMemo(() => {
    if (
      !lessonsQuery.data?.data ||
      !lessonWordsQueries.every((q) => q.isSuccess)
    ) {
      return [];
    }

    const sortedLessons = lessonsQuery.data.data.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedLessons.map((lesson, i) => {
      const wordsData =
        (lessonWordsQueries[i].data?.data as LessonWordData[]) || [];
      return {
        lesson: DateToDateString(lesson.startDate),
        words: wordsData.map((wordData) => ({
          word: wordData.word.word,
          difficulty: wordData.word.difficulty as DifficultyLevel,
        })),
      };
    });
  }, [lessonsQuery.data?.data, lessonWordsQueries]); // <-- Make sure to depend on lessonsQuery.data?.data

  const { data: studentClasses } = useQuery({
    queryKey: ["getClassById"],
    queryFn: () => getClassById(id!),
  });
  const classesData: ClassDataStudentsTeachers | null = studentClasses
    ? studentClasses.data
    : null;

  // Convert military time to default format
  const startTime = militaryTimeToDefaultFormat(
    classesData === null ? "" : classesData.startTime.slice(0, 5),
  );
  const endTime = militaryTimeToDefaultFormat(
    classesData === null ? "" : classesData.endTime.slice(0, 5),
  );

  // Get the day of the week based on the startDay
  const day = NumberToDay[classesData === null ? 0 : classesData.startDay];

  return (
    <Box
      className='w-full pb-8 min-h-screen'
      style={{
        backgroundImage: `url(${
          isMobile ? MobileBackground : DesktopBackground
        })`,
        backgroundSize: "cover",
        backgroundPosition: `${isMobile ? "center" : "left"}`,
        backgroundRepeat: "fixed",
      }}
    >
      <OngoingClassHeader day={`${day}, ${startTime} - ${endTime}`} date='' />
      <Box className='flex justify-center pt-8 px-2'>
        <ClassWordsTable rows={lessonWords} />
      </Box>
    </Box>
  );
};

export default ClassWordsPage;
