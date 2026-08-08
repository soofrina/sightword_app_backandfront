import ClassCards from "@components/class-cards";
import PageTitle from "@components/page-title";
import WordBank from "@base/components/word-bank/word-bank-information";
import { useEffect, useState } from "react";
import AddSortFilterClass from "@components/add-sort-filter-class";
import CreateClassPopup from "@components/create-class-popup";
import { Class, LessonData, LessonWordData } from "@type/dataTypes";
import { useRecoilState, useRecoilValue } from "recoil";
import { filterSelector, sortSelector } from "@recoil/sort-filter-class";
import { sortStrategies, SortStrategyKey } from "@base/type/sortFilter";
import { Box, CircularProgress } from "@mui/material";
import { getClassesByTeacherId } from "@base/api/classes";
import dayjs from "dayjs";
import {
  addLessonWord,
  getLessonWordsByLessonId,
  getLessonsByClassId,
  removeLessonWord,
} from "@base/api/lessons";
import { toastWrong } from "@base/utility/toast";
import { userAtom } from "@recoil/user";

export const DEFAULT_NO_CLASS_SELECTED = "";

const HomePage = () => {
  const [classes, setClasses] = useState<Class[]>([]);

  const [isCreateClassModalOpen, setIsCreateClassModalOpen] =
    useState<boolean>(false);

  const [sortStrategy, setSortStrategy] = useRecoilState(sortSelector);
  const [filterFunctions, setFilterFunctions] = useRecoilState(filterSelector);

  const [selectedClass, setSelectedClass] = useState<string>("");

  const [selectedClassUpcomingLesson, setSelectedClassUpcomingLesson] =
    useState<LessonData>();
  const [lessonWords, setLessonWords] = useState<LessonWordData[]>([]);

  const user = useRecoilValue(userAtom);
  const getTeacherId = () => {
    const roleName = user.roleNames.find((e) => e.role === "teacher");
    if (roleName && roleName.role_id) {
      return roleName.role_id;
    }
    return "";
  };

  const applySortFilter = (classes: Class[]): Class[] => {
    let classesCopy = [...classes];
    if (filterFunctions.length > 0) {
      filterFunctions.forEach((fn) => {
        classesCopy = fn(classesCopy);
      });
    }

    if (sortStrategy) {
      sortStrategies[sortStrategy]?.sort(classesCopy);
    }

    return classesCopy;
  };

  const getClassData = async () => {
    const teacherId = getTeacherId();
    if (!teacherId) return;
    if (classes.length === 0) {
      const classesData = await getClassesByTeacherId(teacherId);
      if (classesData.data === undefined) {
        toastWrong("Something went wrong.");
        return;
      }
      const mappedClasses: Class[] = classesData.data.map((classData) => {
        return {
          id: classData.id,
          day: classData.startDay.toString(),
          startTime: dayjs(classData.startTime, "HH:mm:ssZ"),
          endTime: dayjs(classData.endTime, "HH:mm:ssZ"),
          learningCentre: classData?.centre?.name ?? "",
          teachers: classData.teachers ?? [],
          students: classData.students ?? [],
        };
      });
      const sortedFilteredClasses = applySortFilter(mappedClasses);
      setClasses(sortedFilteredClasses);
    } else {
      const sortedFilteredClasses = applySortFilter(classes);
      setClasses(sortedFilteredClasses);
    }
  };

  useEffect(() => {
    getClassData();
  }, []);

  useEffect(() => {
    if (sortStrategy || filterFunctions.length > 0) {
      getClassData();
    }
  }, [sortStrategy, filterFunctions]);

  // Function to find the upcoming lesson from array of LessonData
  const findUpcomingLesson = (
    lessons: LessonData[],
  ): LessonData | undefined => {
    const now = dayjs();
    const upcoming = lessons
      .filter((lesson) => {
        const lessonStartTime = dayjs(lesson.startDate);
        return lessonStartTime.isAfter(now);
      })
      .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));

    if (upcoming.length > 0) {
      return upcoming[0];
    }

    return undefined;
  };

  const handleClickCard = async (id: string) => {
    setSelectedClass(id);
    const classLessonsData = await getLessonsByClassId(id);
    if (!classLessonsData.data) {
      return;
    }
    const lessons = classLessonsData?.data;
    const upcomingLesson = findUpcomingLesson(lessons);
    setSelectedClassUpcomingLesson(upcomingLesson);
    if (!upcomingLesson) {
      return;
    }

    const lessonWords = await getLessonWordsByLessonId(upcomingLesson.id);
    setLessonWords(lessonWords.data);
  };

  const handleAddClass = () => {
    setIsCreateClassModalOpen(false);
    window.location.reload();
  };

  // Unselect, reset sort and filter on load
  useEffect(() => {
    setSortStrategy(SortStrategyKey.SORT_DAY_ASC);
    setFilterFunctions([]);
    setSelectedClass("");
  }, []);

  const addWord = async (id: string) => {
    if (!selectedClassUpcomingLesson) return;
    const resp = await addLessonWord(id, selectedClassUpcomingLesson?.id);
    if (!resp.data) {
      toastWrong("Error adding word to lesson");
      return;
    }

    const lessonWords = await getLessonWordsByLessonId(
      selectedClassUpcomingLesson.id,
    );
    setLessonWords(lessonWords.data);
  };

  const removeWord = async (id: string) => {
    const resp = await removeLessonWord(id);
    if (!resp.data) {
      toastWrong("Error removing word from lesson");
      return;
    }

    if (!selectedClassUpcomingLesson) return;

    const lessonWords = await getLessonWordsByLessonId(
      selectedClassUpcomingLesson.id,
    );
    setLessonWords(lessonWords.data);
  };

  return (
    <Box className='flex flex-col overflow-y-auto w-full'>
      <CreateClassPopup
        handleClassAdded={handleAddClass}
        popUpTitle='Create Class'
        open={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
      />
      <div className='flex justify-between items-center mr-10'>
        <PageTitle title='Homepage' />
        <AddSortFilterClass
          classes={classes}
          handleAddClass={() => setIsCreateClassModalOpen(true)}
        />
      </div>
      {classes ? (
        <ClassCards
          handleClickCard={(id: string) => handleClickCard(id)}
          selectedClass={selectedClass}
          selectClass={(id: string) => setSelectedClass(id)}
          unselectClass={() => setSelectedClass("")}
          classes={classes}
        />
      ) : (
        <CircularProgress />
      )}
      <div>
        {selectedClass !== DEFAULT_NO_CLASS_SELECTED &&
          selectedClassUpcomingLesson !== undefined && (
            <p className='ml-12 text-sm text-sublineText mb-1'>
              <span className='uppercase font-bold text-subHeaderText'>
                Word Bank for:{" "}
              </span>
              {`Upcoming Lesson on ${dayjs(
                selectedClassUpcomingLesson?.startDate,
              ).format("DD MMM YYYY")}`}
            </p>
          )}
        <WordBank
          removeWord={removeWord}
          addWord={addWord}
          selectedWords={lessonWords.map((lw) => {
            return {
              word: lw.word.word,
              lessonWordId: lw.id,
              wordId: lw.word.id,
            };
          })}
          isVisible={selectedClass !== DEFAULT_NO_CLASS_SELECTED}
          disabled={
            selectedClass !== DEFAULT_NO_CLASS_SELECTED &&
            selectedClassUpcomingLesson === undefined
          }
          disabledText={"No upcoming lesson for the selected class."}
        />
      </div>
    </Box>
  );
};

export default HomePage;
