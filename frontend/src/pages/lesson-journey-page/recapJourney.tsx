import "./lessonJourney.css";
import rotatePhone from "@base/assets/rotatePhone.gif";
import { ReactComponent as ExitLessonIcon } from "assets/exitlesson.svg";
import {
  LessonJourneyRecapStage,
  LessonJourneySection,
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
import { getWordById } from "@base/api/words";
import ProgressBarRecap from "@base/components/progress-bar/ProgressBarRecap";
import { maxProgressSelector, progressSelector } from "@recoil/journey";
import PersonlisationPage from "../personlisation-page/personlisation";
import { ImageApprovalStatus, LessonWordData } from "@base/type/dataTypes";
import { studentRoutes } from "@base/constants/routes";
import { useNavigate } from "react-router";
import { LessonJourneyWord } from "./lessonJourneyV2";
import { toastWrong } from "@base/utility/toast";
import {
  getLessonWordsById,
  getLessonWordsByLessonIdAndStudentId,
} from "@base/api/lessons";
import { userAtom } from "@recoil/user";

interface RecapJourneyProps {
  wordId: string;
  lessonWordId: string;
  isQuiz?: boolean;
}

// Controls entire lesson journey process.
const RecapJourney = ({
  wordId,
  lessonWordId,
  isQuiz = false,
}: RecapJourneyProps) => {
  // ====== STATE (GENERAL) ======
  const [isShowExitPopup, setIsShowExitPopup] = useState<boolean>(false);
  const [words, setWords] = useState<LessonJourneyWord[]>([]);
  const [lessonWord, setLessonWord] = useState<LessonWordData>();
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);

  // state for function which should run when right button clicked
  const [onNext, setOnNext] = useState<() => void>(() => undefined);
  // state for function which should run when left button clicked
  const [onBack, setOnBack] = useState<() => void>(() => undefined);

  // Progress State
  const [currentProgress, setCurrentProgress] =
    useRecoilState(progressSelector);

  // ====== LIFECYCLE (RECAP) ======
  useEffect(() => {
    const getData = async () => {
      if (!wordId || !lessonWordId) {
        return;
      }

      const studentRoles = user.roleNames.filter(
        (role) => role.role === "student",
      );
      if (studentRoles.length === 0 || !studentRoles[0].role_id) {
        return;
      }

      const studentId = studentRoles[0].role_id ?? "";

      getWordById(wordId).then((res) => {
        const lessonJourneyWord: LessonJourneyWord = {
          id: res.data.id,
          word: res.data.word,
          sentence: res.data.sentence,
          images: res.data.images,
          audios: res.data.audios,
          definition: res.data.definition,
          difficulty: res.data.difficulty,
        };
        setWords([lessonJourneyWord]);
      });

      const initialCurrentProgress = {
        section: LessonJourneySection.LRP,
        wordIdx: 0,
        lrpSubstage: LessonJourneyRecapStage.SHOW_WORD,
        quizSubstage: 0,
        resultSubstage: 0,
      };

      if (isQuiz) {
        initialCurrentProgress.section = LessonJourneySection.Quiz;
        initialCurrentProgress.quizSubstage = QuizStage.WRITE_WORD;
      }

      setCurrentProgress(initialCurrentProgress);

      // get lesson word data to get student's personalized image
      // if unable to get lesson word data, just return, use default image
      const lessonWordResp = await getLessonWordsById(lessonWordId);
      if (lessonWordResp.status !== 200) {
        return;
      }
      const lessonId = lessonWordResp.data.lessonId;

      getLessonWordsByLessonIdAndStudentId(lessonId, studentId).then((res) => {
        const lws = res.data;
        if (lws.length === 0) {
          toastWrong("Something went wrong.");
          return;
        }
        const lw = lws.filter((l) => l.word.id === wordId);
        if (lw.length === 0) {
          return;
        }
        setLessonWord(lw[0]);
      });
    };
    getData();
  }, [wordId]);

  // ===== UTIL FUNCTIONS =====
  const handleExitPopupClose = () => {
    setIsShowExitPopup(false);
  };

  function getCurrentWord(): string {
    if (currentProgress.wordIdx >= words.length) return "";

    return words[currentProgress.wordIdx].word;
  }

  const getCurrentWordImage = () => {
    const defaultImage = words[0]?.images[0] ?? "";
    if (
      lessonWord &&
      lessonWord.attempts.length > 0 &&
      lessonWord.attempts[0].imageApprovalStatus ===
        ImageApprovalStatus.APPROVED
    ) {
      return lessonWord.attempts[0].personalisedImageLink;
    }
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

    // last word, transition to quiz
    if (currentProgress.wordIdx === words.length - 1) {
      setOnNext(() => () => {
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          wordIdx: (prevProgress.wordIdx + 1) % words.length,
          quizSubstage: QuizStage.WRITE_WORD,
          section: LessonJourneySection.Quiz,
          lrpSubstage: LessonJourneyRecapStage.SHOW_WORD,
        }));
      });
    } else {
      // transition to next word
      setOnNext(() => () => {
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          wordIdx: prevProgress.wordIdx + 1,
          lrpSubstage: LessonJourneyRecapStage.SHOW_WORD,
        }));
      });
    }
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
      return;
    } else {
      setOnNext(() => () => {
        setCurrentProgress((prevProgress) => ({
          ...prevProgress,
          quizSubstage:
            (prevProgress.quizSubstage + 1) % Object.keys(QuizStage).length,
        }));
      });
      return;
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
    setOnNext(() => () => {
      navigate(studentRoutes.words);
    });
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
                isPastStage
                onLoad={defaultOnLoad}
              />
            )}

          {/* trace word stage */}
          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.TRACE_WORD && (
              <TraceWord
                audio={words[currentProgress.wordIdx]?.audios[0]}
                word={words[currentProgress.wordIdx]?.word}
                isPastStage
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
                isPastStage
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
                isPastStage
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
                isPastStage
                onLoad={defaultOnLoad}
              />
            )}

          {currentProgress.section === LessonJourneySection.LRP &&
            currentProgress.lrpSubstage ===
              LessonJourneyRecapStage.IMAGE_DRAW && (
              <PersonlisationPage
                word={words[currentProgress.wordIdx]?.word}
                sentence={words[currentProgress.wordIdx]?.sentence}
                images={words[currentProgress.wordIdx]?.images}
                isPastStage
                onLoad={defaultOnLoad}
                wordAttemptId={lessonWord?.attempts[0]?.id ?? ""}
                personalisedImageLink={
                  lessonWord?.attempts[0]?.personalisedImageLink ?? ""
                }
                imageApprovalStatus={
                  lessonWord?.attempts[0]?.imageApprovalStatus ??
                  ImageApprovalStatus.PENDING
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
                isPastStage
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
                isPastStage
                onLoad={beforeQuizOnLoad}
              />
            )}

          {/* quiz type word stage */}
          {currentProgress.section === LessonJourneySection.Quiz &&
            currentProgress.quizSubstage === QuizStage.WRITE_WORD && (
              <TypeTheWord
                audio={words[0]?.audios[0]}
                image={getCurrentWordImage()}
                word={words[0]?.word}
                wordIdx={currentProgress.wordIdx}
                isQuiz
                onLoad={defaultQuizOnLoad}
              />
            )}

          {/* quiz fill stage */}
          {currentProgress.section === LessonJourneySection.Quiz &&
            currentProgress.quizSubstage === QuizStage.FILL_BLANK && (
              <FillGaps
                isQuiz
                word={words[0]?.word}
                wordIdx={currentProgress.wordIdx}
                sentence={words[0]?.sentence}
                isPastStage
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
                word={words[0]?.word}
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

export default RecapJourney;
