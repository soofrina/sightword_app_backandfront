import React, { SyntheticEvent, useEffect, useState } from "react";
import AppButton from "@components/app-button";
import WordBank from "@components/word-bank/word-bank-information";
import { ButtonVariant } from "@type/appButton";
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Typography,
  Button,
  Backdrop,
} from "@mui/material";
import {
  Class,
  CreateLessonData,
  ImageApprovalStatus,
  Lesson,
  LessonData,
  LessonProgress,
  LessonWordAttempt,
  LessonWordData,
  StudentData,
  WordAttemptProgress,
  WordMeaningData,
} from "@type/dataTypes";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getBackgroundColor, ProgressStageStatus } from "@type/lessonPlan";
import Table from "@components/Table";
import ProgressCircle from "@base/components/progress-circle";
import AddLessonPopup from "@components/add-lesson-popup";
import {
  addLessonWord,
  createLesson,
  deleteLessonById,
  getLessonWordsByLessonId,
  getLessonsByClassId,
  removeLessonWord,
} from "@base/api/lessons";
import { toastWrong } from "@base/utility/toast";
import { getStudentsFromClass } from "@base/api/classes";
import ApprovePersonalization from "@base/components/approve-personalization";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, className, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={className} sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface LessonPlanProps {
  currentClass: Class | undefined;
}

interface WordProgressCirclesProps {
  progress?: LessonProgress;
  onClick?: () => void;
}

const WordProgressCircles = ({
  progress,
  onClick,
}: WordProgressCirclesProps) => {
  interface Stage {
    letter: string;
    key: string;
  }

  const stages: Stage[] = [
    {
      letter: "L",
      key: "lStatus",
    },
    {
      letter: "P",
      key: "pStatus",
    },
    {
      letter: "R",
      key: "rStatus",
    },
    {
      letter: "Q",
      key: "qStatus",
    },
  ];
  return (
    <>
      {stages.map((stage, idx) => {
        return (
          <ProgressCircle
            onClick={stage === stages[1] ? onClick : undefined}
            key={`progress-circle-${idx}`}
            stageLetter={stage.letter}
            backgroundColor={
              progress
                ? getBackgroundColor(
                    progress[stage.key as keyof typeof progress],
                  )
                : getBackgroundColor(ProgressStageStatus.NOT_ATTEMPTED)
            }
          />
        );
      })}
    </>
  );
};

type StudentProgressRowFormat = {
  id: string;
  student: StudentData;
  progress: LessonProgress[];
  status: string;
};

interface WordData {
  lessonWordId: string;
  word: WordMeaningData;
  lessonWordData: LessonWordData;
}

interface LessonTabData {
  id: string;
  date: string;
}

const LessonPlan = ({ currentClass }: LessonPlanProps) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [showAddLessonPopup, setShowAddLessonPopup] = useState(false);
  const [currentLessonWords, setCurrentLessonWords] = useState<
    LessonWordData[]
  >([]);
  const [lessons, setLessons] = useState<LessonTabData[]>([]);
  const [value, setValue] = useState<number>(0);
  const [isApproveOpen, setIsApproveOpen] = useState<boolean>(false);
  const [approveWord, setApproveWord] = useState<LessonWordData>();
  const [approveStudent, setApproveStudent] = useState<StudentData>();
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onClickProgressCircle = (
    progress: any,
    word: LessonWordData,
    student: StudentData,
  ) => {
    if (!progress) return;
    if (
      [
        ProgressStageStatus.PENDING,
        ProgressStageStatus.FAILED,
        ProgressStageStatus.PASSED,
      ].includes(progress.pStatus)
    ) {
      setIsApproveOpen(true);
      setApproveWord(word);
      setApproveStudent(student);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          sx={{
            color: "#000000",
            fontSize: "14px",
          }}
        >
          {params.row.student.name}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          sx={{
            color: "#000000",
            fontSize: "14px",
          }}
        >
          {params.row.student.email}
        </Typography>
      ),
    },
    {
      field: "id",
      headerName: "ID",
      width: 150,
    },
    ...currentLessonWords.map((lw, idx) => {
      return {
        field: `word${idx + 1}`,
        headerName: `Lesson Progress: Word ${idx + 1}`,
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <WordProgressCircles
            onClick={() =>
              onClickProgressCircle(
                params.row.progress[idx],
                params.row.words[idx],
                params.row.s,
              )
            }
            progress={params.row.progress[idx]}
          />
        ),
      };
    }),
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
  ];

  const border = {
    border: "1px solid #ccc",
    "&.Mui-selected": {
      backgroundColor: "white",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: "light",
    },
  };

  const getLessonsData = async () => {
    const classId = currentClass?.id;
    if (!currentClass || !classId) return;
    const resp = await getLessonsByClassId(classId);
    let lessons: LessonTabData[] = [];
    let lessonsData: LessonData[] = resp.data;
    lessonsData = lessonsData.filter((ld) => {
      const startDate = new Date(ld.startDate);
      return startDate.getTime() > Date.now();
    });
    lessons = lessonsData
      .sort((a, b) => {
        const aDate = new Date(a.startDate);
        const bDate = new Date(b.startDate);
        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
        return 0;
      })
      .map((ld) => {
        return {
          id: ld.id,
          date: new Date(ld.startDate).toDateString(),
        };
      });
    setLessons(lessons);
  };

  useEffect(() => {
    getLessonsData();
  }, []);

  const getLessonWords = async () => {
    const lessonId = lessons[value]?.id;
    if (!lessonId) return;
    const resp = await getLessonWordsByLessonId(lessonId);
    setCurrentLessonWords(resp.data);
  };

  const getClassStudents = async () => {
    if (!currentClass) return;
    const students = await getStudentsFromClass(currentClass?.id);
    setStudents(students.data);
  };

  useEffect(() => {
    getLessonWords();
  }, [lessons, value]);

  useEffect(() => {
    getClassStudents();
  }, [currentClass]);

  // called when lesson is added
  const handleAddLesson = (newLesson: Lesson) => {
    if (
      !currentClass ||
      !currentClass.id ||
      !currentClass?.startTime ||
      !currentClass.endTime
    )
      return;

    const startDate: Date = new Date(newLesson.date);
    startDate.setHours(currentClass.startTime.hour());
    startDate.setMinutes(currentClass.startTime.minute());

    const endDate: Date = new Date(newLesson.date);
    endDate.setHours(currentClass.endTime.hour());
    endDate.setMinutes(currentClass.endTime.minute());

    const createLessonData: CreateLessonData = {
      // eslint-disable-next-line camelcase
      class_id: currentClass?.id,
      // eslint-disable-next-line camelcase
      start_date: startDate,
      // eslint-disable-next-line camelcase
      end_date: endDate,
    };
    createLesson(createLessonData);
    setShowAddLessonPopup(false);

    // refresh lessons
    getLessonsData();
  };

  const handleDeleteLesson = async (lesson?: LessonTabData) => {
    if (!lesson) return;
    const resp = await deleteLessonById(lesson.id);
    if (resp.status !== 200) {
      return;
    }

    getLessonsData();
  };

  const handleAddLessonWord = (lesson?: LessonTabData) => {
    if (!lesson || !lesson.id) {
      return undefined;
    }

    const returnedFunc = async (id: string) => {
      const resp = await addLessonWord(id, lesson?.id);
      if (resp.status !== 201) {
        toastWrong("Something went wrong while adding word to lesson.");
      }
      await getLessonsData();
    };

    return returnedFunc;
  };

  const handleRemoveLessonWord = async (id: string) => {
    const resp = await removeLessonWord(id);
    if (resp.status !== 200) {
      toastWrong("Something went wrong while removing word from lesson.");
    }
    await getLessonsData();
  };

  const getPStatus = (attempt: LessonWordAttempt) => {
    if (attempt.imageApprovalStatus === ImageApprovalStatus.APPROVED) {
      return ProgressStageStatus.PASSED;
    }

    if (attempt.imageApprovalStatus === ImageApprovalStatus.PENDING) {
      return ProgressStageStatus.PENDING;
    }

    if (attempt.imageApprovalStatus === ImageApprovalStatus.REJECTED) {
      return ProgressStageStatus.FAILED;
    }

    if (attempt.progress === WordAttemptProgress.PERSONALISATION) {
      return ProgressStageStatus.IN_PROGRESS;
    }

    return ProgressStageStatus.NOT_ATTEMPTED;
  };

  const getRows = () => {
    const studentsProgress: Record<string, LessonProgress[]> = {};
    students.forEach((s) => {
      studentsProgress[s.id] = [];
    });

    for (let i = 0; i < currentLessonWords.length; i++) {
      const lw = currentLessonWords[i];
      lw.attempts?.forEach((a) => {
        studentsProgress[a.student.id].push({
          lStatus: [
            WordAttemptProgress.COMPLETED,
            WordAttemptProgress.PERSONALISATION,
            WordAttemptProgress.RECALL,
            WordAttemptProgress.QUIZ,
          ].includes(a.progress as WordAttemptProgress)
            ? ProgressStageStatus.PASSED
            : a.progress === WordAttemptProgress.LEARN
            ? ProgressStageStatus.IN_PROGRESS
            : ProgressStageStatus.NOT_ATTEMPTED,
          pStatus: getPStatus(a),
          rStatus: [
            WordAttemptProgress.COMPLETED,
            WordAttemptProgress.QUIZ,
          ].includes(a.progress as WordAttemptProgress)
            ? ProgressStageStatus.PASSED
            : a.progress === WordAttemptProgress.RECALL
            ? ProgressStageStatus.IN_PROGRESS
            : ProgressStageStatus.NOT_ATTEMPTED,
          qStatus:
            a.progress === WordAttemptProgress.COMPLETED
              ? ProgressStageStatus.PASSED
              : ProgressStageStatus.NOT_ATTEMPTED,
        });
      });
    }

    return students.map((s) => {
      return {
        id: s.id,
        student: s,
        progress: studentsProgress[s.id] ?? [],
        words: currentLessonWords,
        status: "Active",
      };
    });
  };

  return (
    <>
      <AddLessonPopup
        currentClass={currentClass}
        open={showAddLessonPopup}
        popUpTitle={"Add Lesson"}
        onClose={() => setShowAddLessonPopup(false)}
        handleAddLesson={(lesson: Lesson) => handleAddLesson(lesson)}
      />
      <Box className='flex items-center justify-between'>
        <p className='font-bold'>Lesson Plans</p>
      </Box>
      <AppBar
        className='self-center z-5 bg-primaryLight dark:bg-primaryLight-d'
        position='static'
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor='primary'
          indicatorColor='primary'
        >
          {lessons.map((lesson, index) => (
            <Tab
              key={`tab-${index}`}
              value={index}
              label={lesson.date}
              sx={border}
            />
          ))}
          <div className='border border-[#ccc] flex item-center'>
            <Button size='small' onClick={() => setShowAddLessonPopup(true)}>
              +
            </Button>
          </div>
        </Tabs>
      </AppBar>
      <div className='mt-8'>
        {lessons.map((lesson, index) => (
          <TabPanel
            key={`tabPanel-${index}`}
            value={value}
            index={index}
            className='p-0'
          >
            <WordBank
              addWord={handleAddLessonWord(lessons[value])}
              removeWord={handleRemoveLessonWord}
              isVisible
              selectedWords={
                value === index
                  ? currentLessonWords.map((w) => {
                      return {
                        lessonWordId: w.id,
                        word: w.word.word,
                        lessonWordData: w,
                        wordId: w.word.id,
                      };
                    })
                  : []
              }
            />
          </TabPanel>
        ))}
      </div>
      <div>
        <p className='font-bold'>Student Progress</p>
        <ApprovePersonalization
          open={isApproveOpen}
          onClose={() => {
            setIsApproveOpen(false);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }}
          studentName={approveStudent?.name ?? ""}
          lessonWordData={approveWord}
        />
        <Table columns={columns} rows={getRows()} />
      </div>
      <div className='mt-2 flex justify-end gap-2'>
        <AppButton
          className='m-2'
          variant={ButtonVariant.SOLID}
          onClick={() => {
            handleDeleteLesson(lessons[value]);
          }}
        >
          Delete Lesson
        </AppButton>
      </div>
    </>
  );
};

export default LessonPlan;
