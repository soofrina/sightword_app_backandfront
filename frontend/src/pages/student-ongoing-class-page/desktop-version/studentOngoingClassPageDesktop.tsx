import OngoingClassHeader from "../ongoingClassHeader/ongoingClassHeader";
import { ReactComponent as Waterfall } from "../waterfall.svg";
import { ReactComponent as WaterfallEnd } from "./waterfallEnd.svg";
import fisherman from "./fisherthem.png";
import WordJourney from "../wordJourney/wordJourney";
import WordToLearn from "../wordToLearn/wordToLearn";
import SolidButton from "@base/components/solid-button/solidButton";
import React, { useRef, useEffect } from "react";
import ManFishingWaterfall from "../../../assets/ManFishingWaterfall.png";
import { Box } from "@mui/material";
import {
  ImageApprovalStatus,
  LessonWordAttempt,
  WordAttemptProgress,
} from "@base/type/dataTypes";

interface StudentOngoingClassPageDesktopProps {
  day: string;
  date: string;
  wordsToLearn: string[];
  wordJourneys: string[];
  attemptData: LessonWordAttempt[];
  goToLesson: () => void;
}

const StudentOngoingClassPageDesktop = ({
  day,
  date,
  wordsToLearn,
  wordJourneys,
  attemptData,
  goToLesson,
}: StudentOngoingClassPageDesktopProps) => {
  const getAttemptData = (index: number) => {
    if (attemptData.length === 0 || index >= attemptData.length) return null;
    return attemptData[index];
  };

  const completedAttempts = attemptData.filter(
    (att) =>
      att.progress === WordAttemptProgress.COMPLETED &&
      att.imageApprovalStatus !== ImageApprovalStatus.REJECTED,
  );
  const isCompleted =
    completedAttempts.length !== 0 &&
    completedAttempts.length === attemptData.length;
  return (
    <Box
      className='w-full min-h-screen pb-8'
      style={{
        backgroundImage: `url(${ManFishingWaterfall})`,
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backgroundAttachment: "scroll", // Make background move with scroll
      }}
    >
      <OngoingClassHeader day={day} date={date} />
      <div className='flex flex-row'>
        <div className='w-1/2 mt-20 ml-20'>
          <div className='font-bold text-xl'>Words to Learn</div>
          <div className='flex flex-wrap relative gap-5'>
            {wordsToLearn.map((wordToLearn) => (
              <WordToLearn word={wordToLearn} key={wordToLearn} />
            ))}
          </div>
          <div className='mt-16'>
            <SolidButton
              disabled={isCompleted}
              onClick={goToLesson}
              content={isCompleted ? "Lesson Completed" : "Let's Begin"}
              width={64}
            />
          </div>
        </div>
        <div className='w-1/2 mt-20'>
          <div className='z-10 relative'>
            <div className='font-bold text-xl mt-3.5 ml-7'>
              Today&apos;s Journey
            </div>
            <div className='z-10'>
              <div className='flex flex-col justify-center ml-5'>
                {wordJourneys.map((wordJourney, index) => (
                  <React.Fragment key={wordJourney}>
                    <WordJourney
                      word={wordJourney}
                      attemptData={getAttemptData(index)}
                    />
                    {index === wordJourneys.length - 1}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default StudentOngoingClassPageDesktop;
