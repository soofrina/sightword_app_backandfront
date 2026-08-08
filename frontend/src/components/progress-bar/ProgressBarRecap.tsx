import { useEffect, useState } from "react";
import {
  JourneyStep,
  LessonJourneyRecapStage,
  LessonJourneySection,
  LessonJourneyStage,
  ResultsStage,
  StepStatus,
} from "@base/type/lessonJourney";
import RoundIconButton from "@components/round-icon-button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import StartPopup from "@base/pages/lesson-journey-page/startPopup/startPopup";
import {
  disableLeftButtonSelector,
  disableRightButtonSelector,
  maxProgressSelector,
  progressSelector,
} from "@recoil/journey";
import { useRecoilState } from "recoil";
import { CheckIcon } from "@heroicons/react/20/solid";
import ProgressStep from "./BigStep";

const SHOWN_START_POPUP = "SHOWN_START_POPUP";

type ProgressBarProps = {
  words: string[];

  onNext: () => void;
  onBack: () => void;
};

const ProgressBarRecap = ({ words, onNext, onBack }: ProgressBarProps) => {
  const [currentProgress, setCurrentProgress] =
    useRecoilState(progressSelector);
  const [maxProgress, setMaxProgress] = useRecoilState(maxProgressSelector);
  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useRecoilState(
    disableLeftButtonSelector,
  );
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  const [startPopup, setStartPopup] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(SHOWN_START_POPUP);
    if (saved && JSON.parse(saved)) {
      handleStartPopupClose();
    } else {
      setStartPopup(true);
    }
  }, []);

  const handleStartPopupClose = () => {
    setStartPopup(false);
    localStorage.setItem(SHOWN_START_POPUP, "true");
  };

  const isFirstStage =
    currentProgress.section === LessonJourneySection.LRP &&
    currentProgress.lrpSubstage === LessonJourneyRecapStage.SHOW_WORD;

  const getCompletedWords = (): JourneyStep[] => {
    const completedWords: JourneyStep[] = words.map((_, idx) => {
      return {
        isLarge: true,
        label: `Word ${idx + 1}`,
        onClick: () => {
          setCurrentProgress({
            wordIdx: idx,
            section: LessonJourneySection.LRP,
            lrpSubstage: LessonJourneyStage.SHOW_WORD,
            quizSubstage: 0,
            resultSubstage: 0,
          });
        },
        status: StepStatus.COMPLETED,
        innerText: "",
      };
    });

    if (currentProgress.section >= LessonJourneySection.Quiz) {
      return completedWords;
    }

    return completedWords.slice(0, currentProgress.wordIdx);
  };

  const getCurrentWordSteps = (): JourneyStep[] => {
    const currentWordSteps: JourneyStep[] = [
      `Word ${currentProgress.wordIdx + 1}`,
      "Show",
      "Learn",
      "Personalise",
      "Recall",
    ].map((str, idx) => {
      if (idx === 0) {
        return {
          isLarge: true,
          label: str,
          onClick: () => undefined,
          status: StepStatus.IN_PROGRESS,
          innerText: (currentProgress.wordIdx + 1).toString(),
        };
      }

      // "Show"
      if (
        currentProgress.lrpSubstage >=
          LessonJourneyRecapStage.SHOW_WORD_AUDIO_SENTENCE &&
        idx === 1
      ) {
        return {
          isLarge: false,
          label: str,
          // if not complete, shouldn't allow navigate to that step
          onClick: () => undefined,
          status:
            currentProgress.lrpSubstage ===
            LessonJourneyRecapStage.SHOW_WORD_AUDIO_SENTENCE
              ? StepStatus.IN_PROGRESS
              : StepStatus.COMPLETED,
          innerText: "",
        };
      }

      // "Learn"
      if (
        currentProgress.lrpSubstage >= LessonJourneyRecapStage.TRACE_WORD &&
        idx === 2
      ) {
        return {
          isLarge: false,
          label: str,
          // if not complete, shouldn't allow navigate to that step
          onClick: () => undefined,
          status:
            currentProgress.lrpSubstage >= LessonJourneyRecapStage.TRACE_WORD &&
            currentProgress.lrpSubstage <= LessonJourneyRecapStage.SENTENCE
              ? StepStatus.IN_PROGRESS
              : StepStatus.COMPLETED,
          innerText: "",
        };
      }

      // "Personalise"
      if (
        currentProgress.lrpSubstage >= LessonJourneyRecapStage.IMAGE_DRAW &&
        idx === 3
      ) {
        return {
          isLarge: false,
          label: str,
          // if not complete, shouldn't allow navigate to that step
          onClick: () => undefined,
          status:
            currentProgress.lrpSubstage === LessonJourneyRecapStage.IMAGE_DRAW
              ? StepStatus.IN_PROGRESS
              : StepStatus.COMPLETED,
          innerText: "",
        };
      }

      // "Recall"
      if (
        currentProgress.lrpSubstage >= LessonJourneyRecapStage.REVIEW &&
        idx === 4
      ) {
        return {
          isLarge: false,
          label: str,
          // if not complete, shouldn't allow navigate to that step
          onClick: () => undefined,
          status:
            currentProgress.lrpSubstage >= LessonJourneyRecapStage.REVIEW &&
            currentProgress.lrpSubstage <= LessonJourneyRecapStage.REVIEW_TRACE
              ? StepStatus.IN_PROGRESS
              : StepStatus.COMPLETED,
          innerText: "",
        };
      }

      return {
        isLarge: false,
        label: str,
        // if not complete, shouldn't allow navigate to that step
        onClick: () => undefined,
        status: StepStatus.NOT_COMPLETED,
        innerText: "",
      };
    });

    if (currentProgress.section >= LessonJourneySection.Quiz) {
      return [];
    }

    return currentWordSteps;
  };

  const incompleteWords: JourneyStep[] =
    currentProgress.section === LessonJourneySection.Quiz
      ? []
      : words
          .map((_, idx) => {
            return {
              isLarge: true,
              label: `Word ${idx + 1}`,
              // if not complete, shouldn't allow navigate to that step
              onClick: () => undefined,
              status: StepStatus.NOT_COMPLETED,
              innerText: (idx + 1).toString(),
            };
          })
          .slice(currentProgress.wordIdx + 1);

  const getQuizSteps = (): JourneyStep[] => {
    const quizSteps: JourneyStep[] = ["Quiz", ...words].map((_, idx) => {
      if (idx === 0) {
        const stepStatus =
          currentProgress.section >= LessonJourneySection.Quiz
            ? StepStatus.IN_PROGRESS
            : StepStatus.NOT_COMPLETED;
        return {
          isLarge: true,
          label: "Quiz",
          onClick: () => undefined,
          status: stepStatus,
          innerText: (words.length + 1).toString(),
        };
      }

      const getStepStatus = (wordIdx: number) => {
        if (currentProgress.section < LessonJourneySection.Quiz) {
          return StepStatus.NOT_COMPLETED;
        }

        if (currentProgress.wordIdx < wordIdx) {
          return StepStatus.NOT_COMPLETED;
        }

        if (currentProgress.wordIdx === wordIdx) {
          return StepStatus.IN_PROGRESS;
        }

        return StepStatus.COMPLETED;
      };

      return {
        isLarge: false,
        label: `Word ${idx}`,
        // if not complete, shouldn't allow navigate to that step
        onClick: () => undefined,
        status: getStepStatus(idx - 1),
        innerText: "",
      };
    });

    if (currentProgress.section < LessonJourneySection.Quiz) {
      return [quizSteps[0]];
    }

    return quizSteps;
  };

  const quizSteps = getQuizSteps();
  return (
    <div id='lesson-journey' className='h-full'>
      <div className='absolute flex mb-5 bottom-2 left-5'>
        {startPopup && <StartPopup onClose={handleStartPopupClose} />}
      </div>
      <div className='flex'>
        <RoundIconButton
          hidden={isFirstStage}
          disabled={isLeftButtonDisabled}
          icon={<ArrowBackIosIcon />}
          className='flex left-5'
          onClick={onBack}
        />
        <div className='flex bottom-8 justify-center w-screen'>
          <nav aria-label='Progress' className='mt-2'>
            <ol role='list' className='flex items-center pl-5'>
              {getCompletedWords().map((step, idx) => {
                return (
                  <ProgressStep
                    key={`completed-big-step-${idx}`}
                    step={step}
                    idx={idx}
                  />
                );
              })}
              {getCurrentWordSteps().map((step, idx) => {
                return (
                  <ProgressStep
                    key={`in-progress-step-${idx}`}
                    step={step}
                    idx={idx}
                  />
                );
              })}
              {incompleteWords.map((step, idx) => {
                return (
                  <ProgressStep
                    key={`incomplete-big-step-${idx}`}
                    step={step}
                    idx={idx}
                  />
                );
              })}
              {quizSteps.map((step, idx) => {
                return (
                  <ProgressStep
                    key={`incomplete-big-step-${idx}`}
                    step={step}
                    idx={idx}
                    isLast={idx === quizSteps.length - 1}
                  />
                );
              })}
            </ol>
          </nav>
        </div>

        {currentProgress.section !== LessonJourneySection.Result && (
          <RoundIconButton
            disabled={isRightButtonDisabled}
            icon={<ArrowForwardIosIcon />}
            className='flex right-5'
            onClick={onNext}
          />
        )}
        <div className='pr-4 w-auto'>
          {currentProgress.section === LessonJourneySection.Result &&
            currentProgress.resultSubstage === ResultsStage.SCORE && (
              <button
                onClick={onNext}
                className={
                  "pointer bg-primaryMain text-white rounded-md px-2 py-1"
                }
              >
                Quiz Breakdown
              </button>
            )}
          {currentProgress.section === LessonJourneySection.Result &&
            currentProgress.resultSubstage === ResultsStage.BREAKDOWN && (
              <button
                onClick={onNext}
                className={
                  "pointer bg-primaryMain text-white rounded-md px-2 py-1"
                }
              >
                Done
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBarRecap;
