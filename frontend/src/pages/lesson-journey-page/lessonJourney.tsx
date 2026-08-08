import "./lessonJourney.css";
import rotatePhone from "@base/assets/rotatePhone.gif";
import { ReactComponent as ExitLessonIcon } from "assets/exitlesson.svg";
import {
  LessonJourneyRecapStage,
  LessonJourneySection,
  Progress,
  QuizStage,
  ResultsStage,
} from "@base/type/lessonJourney";
import { useRecoilState } from "recoil";
import ShowWord from "./show-word/ShowWord";
import ExitPopup from "@base/pages/lesson-journey-page/exitPopup/exitPopup";
import { SvgIcon } from "@mui/material";
import { useEffect, useState } from "react";
import LearnSentence from "@base/components/learn-sentence";
import ShowWordAudioSentence from "@base/components/show-word-audio-sentence";
import TraceWord from "@base/components/trace-word/TraceWord";
import WordCloud from "@base/components/word-cloud/wordCloud";
import FillInBlanks from "@base/components/fill-in-blanks/fillInBlanks";
import TypeTheWord from "@base/components/recall-type-the-word/typeTheWord";
import FillGaps from "@base/components/quiz-fill-gaps/fillGaps";
import QuizBreakdown from "@base/components/quiz-breakdown/QuizBreakdown";
import QuizScore from "@base/components/quiz-score/QuizScore";
import ProgressBarRecap from "@base/components/progress-bar/ProgressBarRecap";
import { maxProgressSelector, progressSelector } from "@recoil/journey";
import PersonlisationPage from "../personlisation-page/personlisation";
import {
  ImageApprovalStatus,
  LessonWordAttempt,
  LessonWordData,
  WordAttemptProgress,
} from "@base/type/dataTypes";
import { studentRoutes } from "@base/constants/routes";
import { useNavigate } from "react-router";
import { LessonJourneyWord } from "./lessonJourneyV2";
import { userAtom } from "@recoil/user";
import {
  createNewWordAttempt,
  getLessonWordsByLessonId,
  updateWordAttempt,
} from "@base/api/lessons";
import { useQuery } from "@tanstack/react-query";
import { toastWrong } from "@base/utility/toast";

interface LessonJourneyProps {
  lessonId: string;
}

// Controls entire lesson journey process.
const LessonJourney = ({ lessonId }: LessonJourneyProps) => {
  // ====== STATE ======
  const navigate = useNavigate();
  const [isShowExitPopup, setIsShowExitPopup] = useState<boolean>(false);
  const [isRefreshLessonWords, setIsRefreshLessonWords] =
    useState<boolean>(true);

  // words
  const [words, setWords] = useState<LessonJourneyWord[]>([]);

  // state for function which should run when right button clicked
  const [onNext, setOnNext] = useState<() => void>(() => undefined);
  // state for function which should run when left button clicked
  const [onBack, setOnBack] = useState<() => void>(() => undefined);

  // ====== RECOIL STATES ========
  // progress states
  const [currentProgress, setCurrentProgress] =
    useRecoilState(progressSelector);
  const [maxProgress, setMaxProgress] = useRecoilState(maxProgressSelector);

  // user data states
  const [user, setUser] = useRecoilState(userAtom);
  const [studentId, setStudentId] = useState<string>("");

  // ====== LIFECYCLE (GENERAL) ======
  // Upon loading component, retrieve student data. Set student data using getStudentData query result.
  useEffect(() => {
    const studentRoles = user.roleNames.filter(
      (role) => role.role === "student",
    );
    if (studentRoles.length === 0 || !studentRoles[0].role_id) {
      return;
    }
    setStudentId(studentRoles[0].role_id);
  }, []);

  // ====== LIFECYCLE (LESSON) ======
  const convertLwAttemptToStage = (
    lwAttempt: LessonWordAttempt,
  ): LessonJourneyRecapStage => {
    // if rejected, means need to go to image draw stage to reupload/redraw.
    if (lwAttempt.imageApprovalStatus === ImageApprovalStatus.REJECTED) {
      return LessonJourneyRecapStage.IMAGE_DRAW;
    }

    if (lwAttempt.progress === WordAttemptProgress.LEARN) {
      return LessonJourneyRecapStage.TRACE_WORD;
    }

    if (lwAttempt.progress === WordAttemptProgress.PERSONALISATION) {
      return LessonJourneyRecapStage.IMAGE_DRAW;
    }

    if (lwAttempt.progress === WordAttemptProgress.RECALL) {
      return LessonJourneyRecapStage.REVIEW;
    }

    return LessonJourneyRecapStage.REVIEW_TRACE;
  };

  const getLessonWords = useQuery({
    enabled: lessonId !== undefined,
    queryKey: ["getLessonWords", isRefreshLessonWords],
    retry: 3,
    queryFn: () => getLessonWordsByLessonId(lessonId),
  });
  const lws: LessonWordData[] = getLessonWords?.data?.data ?? [];
  lws.forEach((lw) => {
    // sort each lessonword's attempts in descending attempt time order, latest attempt at idx 0
    lw.attempts.sort(
      (a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime(),
    );
  });

  useEffect(() => {
    if (getLessonWords.isSuccess) {
      setIsRefreshLessonWords(false);
    }
  }, [getLessonWords.isLoading]);

  // Upon loading component, and lessonId is available, update the current progress
  useEffect(() => {
    if (!lessonId) return;
    if (!getLessonWords.data) return;
    setWords(
      lws.map((lw) => {
        const lessonJourneyWord: LessonJourneyWord = {
          id: lw.word.id,
          word: lw.word.word,
          sentence: lw.word.sentence,
          images: lw.word.images,
          audios: lw.word.audios,
          definition: lw.word.definition,
          difficulty: lw.word.difficulty,
        };
        return lessonJourneyWord;
      }),
    );

    // cases
    // case 1: no lesson word attempts at all - i.e. fresh start
    // case 2: have lesson word attempts, but some words have no attempt
    // case 3: halfway through LRP stage for some word (i.e. have word attempts, but not for all words)
    const lessonWordsNoAttempts = [...lws].filter(
      (lw) => lw.attempts.length === 0,
    );

    if (lessonWordsNoAttempts.length <= lws.length) {
      for (let idx = 0; idx < lws.length; idx++) {
        const lw = lws[idx];
        const numLwAttempts = lw.attempts.length;
        // case 1 & 2
        if (numLwAttempts === 0) {
          const progress: Progress = {
            lrpSubstage: LessonJourneyRecapStage.SHOW_WORD,
            quizSubstage: 0,
            resultSubstage: 0,
            wordIdx: idx,
            section: LessonJourneySection.LRP,
          };
          setCurrentProgress(progress);
          setMaxProgress(progress);
          break;
        }

        // case 3
        const latestLwAttempt = lw.attempts[numLwAttempts - 1];
        if (
          latestLwAttempt.imageApprovalStatus ===
            ImageApprovalStatus.REJECTED ||
          (latestLwAttempt.progress !== WordAttemptProgress.QUIZ &&
            latestLwAttempt.progress !== WordAttemptProgress.COMPLETED)
        ) {
          const progress: Progress = {
            lrpSubstage: convertLwAttemptToStage(latestLwAttempt),
            quizSubstage: 0,
            resultSubstage: 0,
            wordIdx: idx,
            section: LessonJourneySection.LRP,
          };
          setCurrentProgress(progress);
          setMaxProgress(progress);
          break;
        }
      }
      return;
    }

    // case 4: completed LRP stages for all words, now quiz stage
    const lessonWordsQuizStage = [...lws].filter((lw) => {
      const numLwAttempts = lw.attempts.length;
      const latestLwAttempt = lw.attempts[numLwAttempts - 1];
      return latestLwAttempt.progress === WordAttemptProgress.QUIZ;
    });
    if (lessonWordsQuizStage.length === lws.length) {
      const progress: Progress = {
        lrpSubstage: 0,
        quizSubstage: QuizStage.WRITE_WORD,
        resultSubstage: 0,
        wordIdx: 0,
        section: LessonJourneySection.Quiz,
      };
      setCurrentProgress(progress);
      setMaxProgress(progress);
      return;
    }
  }, [getLessonWords.isLoading]);

  useEffect(() => {
    if (
      currentProgress.section === maxProgress.section &&
      currentProgress.wordIdx === maxProgress.wordIdx &&
      currentProgress.lrpSubstage > maxProgress.lrpSubstage
    ) {
      setMaxProgress({ ...currentProgress });
    }
  }, [currentProgress]);

  // ===== UTIL FUNCTIONS =====
  const handleExitPopupClose = () => {
    setIsShowExitPopup(false);
  };

  function getCurrentWord(): string {
    if (currentProgress.wordIdx >= words.length) return "";

    return words[currentProgress.wordIdx].word;
  }

  const getCurrentWordImage = () => {
    const latestLwAttempt = lws[currentProgress.wordIdx]?.attempts[0];
    if (latestLwAttempt?.imageApprovalStatus === ImageApprovalStatus.APPROVED) {
      return latestLwAttempt?.personalisedImageLink;
    }

    const defaultImage = words[0]?.images[0] ?? "";
    return defaultImage;
  };

  const getCurrentWordAudio = (): string => {
    if (
      !words[currentProgress.wordIdx]?.audios ||
      words[currentProgress.wordIdx]?.audios.length === 0
    ) {
      return "";
    }

    return words[currentProgress.wordIdx].audios[0];
  };

  // the default on load function to run in each component for LRP components
  // sets on back to decrease lrpsubstage by 1
  // sets on next to increase lrpsubstage by 1
  const defaultOnLoad = () => {
    setOnBack(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage - 1,
      }));
    });
    setOnNext(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage + 1,
      }));
    });
  };

  const showToLearnOnLoad = (
    currentProgress?: Progress,
    maxProgress?: Progress,
  ) => {
    setOnBack(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage - 1,
      }));
    });
    setOnNext(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage + 1,
      }));

      if (!currentProgress || !maxProgress) {
        return;
      }

      if (isPastStage(currentProgress, maxProgress)) {
        return;
      }

      if (!lws[currentProgress.wordIdx]) {
        return;
      }

      createNewWordAttempt(lws[currentProgress.wordIdx].id, studentId)
        .then(() => {
          setIsRefreshLessonWords(true);
        })
        .catch((err) => {
          console.log(err);
          toastWrong(
            "Something went wrong. Please refresh the page and try again.",
          );
        });
    });
  };

  const learnToPersonalizeOnLoad = (
    currentProgress?: Progress,
    maxProgress?: Progress,
  ) => {
    setOnBack(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage - 1,
      }));
    });
    setOnNext(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage + 1,
      }));

      if (!currentProgress || !maxProgress) {
        return;
      }

      if (isPastStage(currentProgress, maxProgress)) {
        return;
      }

      if (!lws[currentProgress.wordIdx]) {
        return;
      }

      updateWordAttempt(
        lws[currentProgress.wordIdx].attempts[0].id,
        WordAttemptProgress.PERSONALISATION,
        lws[currentProgress.wordIdx].attempts[0].imageApprovalStatus,
      );
    });
  };

  const personalizeToRecallOnLoad = (
    currentProgress?: Progress,
    maxProgress?: Progress,
  ) => {
    setOnBack(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage - 1,
      }));
    });
    setOnNext(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage + 1,
      }));

      if (!currentProgress || !maxProgress) {
        return;
      }

      if (isPastStage(currentProgress, maxProgress)) {
        return;
      }

      if (!lws[currentProgress.wordIdx]) {
        return;
      }

      updateWordAttempt(
        lws[currentProgress.wordIdx].attempts[0].id,
        WordAttemptProgress.RECALL,
        lws[currentProgress.wordIdx].attempts[0].imageApprovalStatus,
      );
    });
  };

  // the custom on load function to run in the component before the quiz section
  // sets on back to decrease lrpsubstage by 1
  // sets on next to change to quiz section
  const beforeQuizOnLoad = () => {
    setOnBack(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        lrpSubstage: prevProgress.lrpSubstage - 1,
      }));
    });

    setOnNext(() => () => {
      if (currentProgress.wordIdx === words.length - 1) {
        // last word, transition to quiz
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          wordIdx: (prevProgress.wordIdx + 1) % words.length,
          quizSubstage: QuizStage.WRITE_WORD,
          section: LessonJourneySection.Quiz,
          lrpSubstage: LessonJourneyRecapStage.SHOW_WORD,
        }));
      } else {
        // transition to next word
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          wordIdx: prevProgress.wordIdx + 1,
          lrpSubstage: LessonJourneyRecapStage.SHOW_WORD,
        }));
      }

      if (!currentProgress || !maxProgress) {
        return;
      }

      if (isPastStage(currentProgress, maxProgress)) {
        return;
      }

      if (!lws[currentProgress.wordIdx]) {
        return;
      }

      updateWordAttempt(
        lws[currentProgress.wordIdx].attempts[0].id,
        WordAttemptProgress.QUIZ,
        lws[currentProgress.wordIdx].attempts[0].imageApprovalStatus,
      );
    });
  };

  const defaultQuizOnLoad = () => {
    // don't need on back, by right cannot navigate back when in quiz section
    setOnBack(() => undefined);

    if (
      currentProgress.wordIdx === words.length - 1 &&
      currentProgress.quizSubstage === QuizStage.FILL_BLANK
    ) {
      setOnNext(() => () => {
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          section: LessonJourneySection.Result,
          quizSubstage: 0,
          resultSubstage: ResultsStage.SCORE,
        }));
      });
    } else if (currentProgress.quizSubstage === QuizStage.FILL_BLANK) {
      setOnNext(() => () => {
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          quizSubstage: QuizStage.WRITE_WORD,
          wordIdx: currentProgress.wordIdx + 1,
        }));
      });
    } else {
      setOnNext(() => () => {
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          quizSubstage:
            (prevProgress.quizSubstage + 1) % Object.keys(QuizStage).length,
        }));
      });
    }
  };

  const defaultScoreOnLoad = () => {
    setOnNext(() => () => {
      setCurrentProgress((prevProgress) => ({
        ...prevProgress,
        resultSubstage: prevProgress.resultSubstage + 1,
      }));
    });
  };

  const defaultBreakdownOnLoad = () => {
    lws.forEach((lw) => {
      updateWordAttempt(
        lw.attempts[0].id,
        WordAttemptProgress.COMPLETED,
        lw.attempts[0].imageApprovalStatus,
      );
    });
    setOnNext(() => () => {
      navigate(-1);
    });
  };

  const isPastStage = (curr: Progress, max: Progress) => {
    return (
      curr.wordIdx < max.wordIdx ||
      (curr.wordIdx === max.wordIdx && curr.lrpSubstage < max.lrpSubstage)
    );
  };

  return (
    <div className='h-screen select-none'>
      <div className='RotatePhone'>
        <img className='RotatePhoneAsset' src={rotatePhone} />
        <p className='text-xl text-white'>
          Please rotate your phone to view the lesson!
        </p>
      </div>
      <div className='flex flex-col h-screen pt-4'>
        <div className='absolute top-2 left-2'>
          <SvgIcon className='w-5 h-5' component={ExitLessonIcon} />
          <button
            className='text-textSecondary'
            onClick={() => setIsShowExitPopup(true)}
          >
            Exit Lesson
          </button>
        </div>
        <div className='absolute flex w-screen justify-center align-center'>
          <ExitPopup open={isShowExitPopup} onClose={handleExitPopupClose} />
        </div>
        <div className='h-[75vh]'>
          {/* show word stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.SHOW_WORD && (
              <ShowWord
                stage={currentProgress.wordIdx}
                word={getCurrentWord()}
                onLoad={defaultOnLoad}
              />
            )}

          {/* show word audio sentence stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.SHOW_WORD_AUDIO_SENTENCE && (
              <ShowWordAudioSentence
                audio={getCurrentWordAudio()}
                image={getCurrentWordImage()}
                word={words[currentProgress.wordIdx]?.word}
                sentence={words[currentProgress.wordIdx]?.sentence}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={showToLearnOnLoad}
              />
            )}

          {/* trace word stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.TRACE_WORD && (
              <TraceWord
                audio={words[currentProgress.wordIdx]?.audios[0]}
                word={words[currentProgress.wordIdx]?.word}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={defaultOnLoad}
              />
            )}

          {/* word cloud stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.WORD_CLOUD && (
              <WordCloud
                audio={words[currentProgress.wordIdx]?.audios[0]}
                word={words[currentProgress.wordIdx]?.word}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={defaultOnLoad}
              />
            )}

          {/* fill in blanks stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.FILL_WORD && (
              <FillInBlanks
                audio={words[currentProgress.wordIdx]?.audios[0]}
                word={words[currentProgress.wordIdx]?.word}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={defaultOnLoad}
              />
            )}

          {/* learn sentence stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.SENTENCE && (
              <LearnSentence
                audio={words[currentProgress.wordIdx]?.audios[0]}
                word={words[currentProgress.wordIdx]?.word}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={learnToPersonalizeOnLoad}
              />
            )}

          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.IMAGE_DRAW && (
              <PersonlisationPage
                word={words[currentProgress.wordIdx]?.word}
                sentence={words[currentProgress.wordIdx]?.sentence}
                images={words[currentProgress.wordIdx]?.images}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={personalizeToRecallOnLoad}
                wordAttemptId={
                  lws[currentProgress.wordIdx]?.attempts[0]?.id ?? ""
                }
                personalisedImageLink={
                  lws[currentProgress.wordIdx]?.attempts[0]
                    ?.personalisedImageLink ?? ""
                }
                imageApprovalStatus={
                  lws[currentProgress.wordIdx]?.attempts[0]
                    ?.imageApprovalStatus ?? ImageApprovalStatus.PENDING
                }
              />
            )}
          {/* review stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage === LessonJourneyRecapStage.REVIEW && (
              <ShowWordAudioSentence
                audio={getCurrentWordAudio()}
                image={getCurrentWordImage()}
                word={words[currentProgress.wordIdx]?.word}
                sentence={words[currentProgress.wordIdx]?.sentence}
                header="Let's review what you have learnt so far!"
                onLoad={defaultOnLoad}
              />
            )}

          {/* review type stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.REVIEW_TYPE && (
              <TypeTheWord
                audio={words[currentProgress.wordIdx]?.audios[0]}
                image={getCurrentWordImage()}
                word={words[currentProgress.wordIdx]?.word}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={defaultOnLoad}
              />
            )}

          {/* review trace stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.REVIEW_TRACE && (
              <TraceWord
                word={words[currentProgress.wordIdx]?.word}
                isRecall
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={beforeQuizOnLoad}
              />
            )}

          {/* quiz type word stage */}
          {currentProgress.section === LessonJourneySection.Quiz &&
            currentProgress.quizSubstage === QuizStage.WRITE_WORD && (
              <TypeTheWord
                audio={words[currentProgress.wordIdx]?.audios[0]}
                image={getCurrentWordImage()}
                word={words[currentProgress.wordIdx]?.word}
                wordIdx={currentProgress.wordIdx}
                isQuiz
                onLoad={defaultQuizOnLoad}
                wordAttemptId={lws[currentProgress.wordIdx]?.attempts[0].id}
              />
            )}

          {/* quiz fill stage */}
          {currentProgress.section === LessonJourneySection.Quiz &&
            currentProgress.quizSubstage === QuizStage.FILL_BLANK && (
              <FillGaps
                isQuiz
                word={words[currentProgress.wordIdx]?.word}
                wordIdx={currentProgress.wordIdx}
                sentence={words[currentProgress.wordIdx]?.sentence}
                isPastStage={isPastStage(currentProgress, maxProgress)}
                onLoad={defaultQuizOnLoad}
              />
            )}
          {currentProgress.section === LessonJourneySection.Result &&
            currentProgress.resultSubstage === ResultsStage.SCORE && (
              <QuizScore onLoad={defaultScoreOnLoad} />
            )}
          {currentProgress.section === LessonJourneySection.Result &&
            currentProgress.resultSubstage === ResultsStage.BREAKDOWN && (
              <QuizBreakdown
                lessonId={lessonId}
                onLoad={defaultBreakdownOnLoad}
              />
            )}
        </div>
        <div className='h-2'>
          <ProgressBarRecap
            onNext={onNext}
            onBack={onBack}
            words={words.map((w) => w.word)}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonJourney;
