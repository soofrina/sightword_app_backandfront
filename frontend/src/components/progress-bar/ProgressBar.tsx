import { useEffect, useState } from "react";
import { LessonJourneyStage, QuizStage } from "@base/type/lessonJourney";
import RoundIconButton from "@components/round-icon-button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import StartPopup from "@base/pages/lesson-journey-page/startPopup/startPopup";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useRecoilState } from "recoil";
import { RssFeedOutlined } from "@mui/icons-material";
import { updateWordAttempt } from "@base/api/lessons";
import { LessonWordAttempt } from "@base/type/dataTypes";

const SHOWN_START_POPUP = "SHOWN_START_POPUP";

type Step = {
  name: string;
  href: string;
  status: string;
  isLarge: boolean;
  insideText?: number;
  parentStage?: string;
};

type ProgressBarProps = {
  currentWordAttempt?: LessonWordAttempt | undefined;
  words: string[];
};

const ProgressBar = ({ currentWordAttempt, words }: ProgressBarProps) => {
  // const stages = words.length + 1; // for quiz
  // const subStages = ["Show", "Learn", "Personalise", "Recall"];

  // const [stage, setStage] = useRecoilState(stageSelector);
  // const [substage, setSubstage] = useRecoilState(substageSelector);
  // const [quizSubstage, setQuizSubstage] = useRecoilState(quizSubstageSelector);
  // const [hideLeftButton, setHideLeftButton] = useRecoilState(
  //   disableLeftButtonSelector,
  // );
  // const [disableRightButton, setDisableRightButton] = useRecoilState(
  //   disableRightButtonSelector,
  // );

  // const [startPopup, setStartPopup] = useState<boolean>(false);

  // const setLearningJourney = (strArr: string[]): Step[] => {
  //   const res = [];
  //   for (let i = 0; i < strArr.length; i++) {
  //     const temp = "Word " + (i + 1).toString();
  //     const obj = {
  //       name: temp,
  //       href: "#",
  //       status: i == 0 ? "current" : "upcoming",
  //       isLarge: true,
  //       insideText: i + 1,
  //     };
  //     res.push(obj);
  //     for (let j = 0; j < subStages.length; j++) {
  //       res.push({
  //         name: subStages[j],
  //         href: "#",
  //         status: "upcoming",
  //         isLarge: false,
  //         parentStage: strArr[i],
  //       });
  //     }
  //   }
  //   res.push({
  //     name: "Quiz",
  //     href: "#",
  //     status: "upcoming",
  //     isLarge: true,
  //     insideText: words.length + 1,
  //   });
  //   for (let i = 0; i < words.length; i++) {
  //     const temp = "Word" + (i + 1).toString();
  //     res.push({
  //       name: temp,
  //       href: "#",
  //       status: "upcoming",
  //       isLarge: false,
  //       parentStage: "Quiz",
  //     });
  //   }
  //   return res;
  // };

  // const [steps, setSteps] = useState<Step[]>([]);
  // const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);

  // useEffect(() => {
  //   const saved = localStorage.getItem(SHOWN_START_POPUP);
  //   if (saved && JSON.parse(saved)) {
  //     handleStartPopupClose();
  //   } else {
  //     setStartPopup(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   const stepsArr = setLearningJourney(words);
  //   const filteredSteps = stepsArr.filter(
  //     (steps) =>
  //       steps.parentStage === words[stage] ||
  //       steps.isLarge ||
  //       (steps.parentStage === "Quiz" && stage === words.length),
  //   );
  //   setSteps(stepsArr);
  //   setFilteredSteps(filteredSteps);
  // }, [words.length]);

  // useEffect(() => {
  //   if (steps.length <= 1 || words.length === 0) {
  //     return;
  //   }

  //   const newSteps = [...steps];
  //   let currentStep = 0;
  //   for (let i = 0; i <= stage; i++) {
  //     // defensive check
  //     if (currentStep >= newSteps.length) {
  //       break;
  //     }

  //     // for the current stage
  //     if (i === stage) {
  //       if (i >= words.length && quizSubstage === QuizStage.WRITE_WORD) {
  //         newSteps[currentStep].status = "complete";
  //         if (currentStep + 1 < newSteps.length) {
  //           newSteps[currentStep + 1].status = "current";
  //         }
  //         currentStep += 1;
  //         continue;
  //       }

  //       for (let j = 0; j < substage; j++) {
  //         // not quiz stage
  //         if (
  //           i < words.length &&
  //           (j === LessonJourneyStage.REVIEW_TRACE ||
  //             j === LessonJourneyStage.SHOW_WORD ||
  //             j === LessonJourneyStage.SHOW_WORD_AUDIO_SENTENCE ||
  //             j === LessonJourneyStage.SENTENCE ||
  //             j === LessonJourneyStage.IMAGE_DRAW)
  //         ) {
  //           newSteps[currentStep].status = "complete";
  //           if (currentStep + 1 < newSteps.length) {
  //             newSteps[currentStep + 1].status = "current";
  //           }
  //           currentStep += 1;
  //         } else {
  //           if (j === QuizStage.FILL_BLANK) {
  //             newSteps[currentStep].status = "complete";
  //             if (currentStep + 1 < newSteps.length) {
  //               newSteps[currentStep + 1].status = "current";
  //             }
  //             currentStep += 1;
  //           }
  //         }
  //       }
  //     } else {
  //       // for previous stages
  //       for (let j = 0; j <= LessonJourneyStage.REVIEW_TRACE; j++) {
  //         // not quiz stage
  //         if (
  //           i < words.length &&
  //           (j === LessonJourneyStage.REVIEW_TRACE ||
  //             j === LessonJourneyStage.SHOW_WORD ||
  //             j === LessonJourneyStage.SHOW_WORD_AUDIO_SENTENCE ||
  //             j === LessonJourneyStage.SENTENCE ||
  //             j === LessonJourneyStage.IMAGE_DRAW)
  //         ) {
  //           newSteps[currentStep].status = "complete";
  //           if (currentStep + 1 < newSteps.length) {
  //             newSteps[currentStep + 1].status = "current";
  //           }
  //           currentStep += 1;
  //         } else {
  //           if (j === QuizStage.FILL_BLANK) {
  //             newSteps[currentStep].status = "complete";
  //             if (currentStep + 1 < newSteps.length) {
  //               newSteps[currentStep + 1].status = "current";
  //             }
  //             currentStep += 1;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   setSteps(newSteps);
  // }, [substage, stage, quizSubstage, steps.length, words.length]);

  // const handleStartPopupClose = () => {
  //   setStartPopup(false);
  //   localStorage.setItem(SHOWN_START_POPUP, "true");
  // };

  // const handleBack = () => {
  //   if (substage === 0 && stage === 0) return;

  //   if (substage === LessonJourneyStage.SHOW_WORD) {
  //     setSubstage(LessonJourneyStage.REVIEW_TRACE);
  //     setStage(stage - 1);
  //   } else if (
  //     substage === LessonJourneyStage.REVIEW ||
  //     substage === LessonJourneyStage.IMAGE_DRAW ||
  //     substage === LessonJourneyStage.WORD_CLOUD ||
  //     substage === LessonJourneyStage.SHOW_WORD_AUDIO_SENTENCE
  //   ) {
  //     setSubstage(substage - 1);
  //   } else if (stage === stages - 1 && (substage === 3 || substage === 4)) {
  //     setSubstage(substage - 1);
  //   } else {
  //     setSubstage(substage - 1);
  //   }
  // };

  // const handleNext = () => {
  //   // special case, need to update the endpoint that the stage has reached progress = quiz
  //   if (stage === stages - 1 && substage === LessonJourneyStage.REVIEW_TRACE)
  //     return;

  //   if (substage === LessonJourneyStage.REVIEW_TRACE && currentWordAttempt) {
  //     updateWordAttempt(
  //       currentWordAttempt.id,
  //       Progress.QUIZ,
  //       currentWordAttempt.imageApprovalStatus,
  //     );
  //   }

  //   // quiz mode
  //   if (stage >= words.length) {
  //     if (quizSubstage === QuizStage.FILL_BLANK) {
  //       setStage(stage + 1);
  //       setQuizSubstage(QuizStage.WRITE_WORD);
  //     } else {
  //       setQuizSubstage(quizSubstage + 1);
  //     }
  //     return;
  //   }

  //   if (substage === LessonJourneyStage.REVIEW_TRACE) {
  //     setStage(stage + 1);
  //     setSubstage(0);
  //   } else {
  //     setSubstage(substage + 1);
  //   }
  // };

  // function classNames(...classes: string[]) {
  //   return classes.filter(Boolean).join(" ");
  // }

  // const isFirstStage = stage === 0 && substage === 0;

  return (
    <div id='lesson-journey' className='h-full'>
      {/* <div className='absolute flex mb-5 bottom-2 left-5'>
        {startPopup && <StartPopup onClose={handleStartPopupClose} />}
      </div>
      <div className='flex'>
        <RoundIconButton
          hidden={isFirstStage || hideLeftButton}
          icon={<ArrowBackIosIcon />}
          className='flex left-5'
          onClick={handleBack}
        />
        <div className='flex bottom-8 justify-center w-screen'>
          <nav aria-label='Progress' className='mt-2'>
            <ol role='list' className='flex items-center pl-5'>
              {steps
                .filter(
                  (steps) =>
                    steps.parentStage === words[stage] ||
                    steps.isLarge ||
                    (steps.parentStage === "Quiz" && stage === stages - 1),
                )
                .map((step, stepIdx) => {
                  return (
                    <li
                      key={step.name}
                      className={classNames(
                        stepIdx !== steps.length - 1 ? "pr-8 sm:pr-10" : "",
                        "relative",
                      )}
                    >
                      {(step.parentStage === words[stage] ||
                        step.isLarge ||
                        (step.parentStage === "Quiz" && stage < stages)) &&
                        (step.status === "complete" ? (
                          // COMPLETED STEP
                          <>
                            <div
                              className='absolute inset-0 flex items-center'
                              aria-hidden='true'
                            >
                              <div className='h-0.5 w-full bg-primaryMain' />
                            </div>
                            <a
                              href='#'
                              className={`relative flex items-center justify-center rounded-full bg-primaryMain whitespace-nowrap
                      ${step.isLarge ? "h-9 w-9" : "h-6 w-6"}`}
                            >
                              {!step.insideText && (
                                <CheckIcon
                                  className='h-3 w-3 text-white'
                                  aria-hidden='true'
                                />
                              )}
                              {step.insideText && (
                                <span className='font-semibold text-white'>
                                  {step.insideText}
                                </span>
                              )}
                              <span
                                className={`absolute text-primaryMain ${
                                  step.isLarge
                                    ? "font-semibold text-base -bottom-6"
                                    : "text-xs -bottom-5"
                                } whitespace-nowrap`}
                              >
                                {step.name}
                              </span>
                            </a>
                          </>
                        ) : step.status === "current" ? (
                          // CURRENT STEP
                          <>
                            {stepIdx !== filteredSteps.length - 1 && (
                              <div
                                className='absolute inset-0 flex items-center'
                                aria-hidden='true'
                              >
                                <div className='h-0.5 w-full bg-gray-300' />
                              </div>
                            )}
                            <a
                              href='#'
                              className={`relative flex items-center justify-center rounded-full border-2 bg-primaryMain border-[#E17968]
                      ${
                        step.isLarge ? "h-9 w-9" : "h-6 w-6"
                      } whitespace-nowrap`}
                              aria-current='step'
                            >
                              {step.insideText && (
                                <span className='font-semibold text-white'>
                                  {step.insideText}
                                </span>
                              )}
                              <span
                                className={`absolute text-primaryMain ${
                                  step.isLarge
                                    ? "font-semibold text-base -bottom-6"
                                    : "text-xs -bottom-[22px]"
                                }`}
                              >
                                {step.name}
                              </span>
                            </a>
                          </>
                        ) : (
                          // UPCOMING STEP
                          <>
                            {stepIdx !== filteredSteps.length - 1 && (
                              <div
                                className='absolute inset-0 flex items-center'
                                aria-hidden='true'
                              >
                                <div className='h-0.5 w-full bg-gray-300' />
                              </div>
                            )}
                            <a
                              href='#'
                              className={`group relative flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-300 ${
                                step.isLarge ? "h-9 w-9" : "h-6 w-6"
                              } whitespace-nowrap`}
                            >
                              {step.insideText && (
                                <span className='font-semibold text-gray-400'>
                                  {step.insideText}
                                </span>
                              )}
                              <span
                                className={`absolute text-gray-400 ${
                                  step.isLarge
                                    ? "font-semibold text-base -bottom-6"
                                    : "text-xs -bottom-[22px]"
                                }`}
                              >
                                {step.name}
                              </span>
                            </a>
                          </>
                        ))}
                    </li>
                  );
                })}
            </ol>
          </nav>
        </div>

        <RoundIconButton
          disabled={disableRightButton}
          icon={<ArrowForwardIosIcon />}
          className='flex right-5'
          onClick={handleNext}
        />
      </div> */}
    </div>
  );
};

export default ProgressBar;
