import OngoingClassHeader from "../ongoingClassHeader/ongoingClassHeader";
import WordJourney from "../wordJourney/wordJourney";
import WordToLearn from "../wordToLearn/wordToLearn";
import SolidButton from "@base/components/solid-button/solidButton";
import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Waterfall from "../../../assets/WaterFall.png";
import { useParams } from "react-router-dom";
import {
  ImageApprovalStatus,
  LessonWordAttempt,
  WordAttemptProgress,
} from "@base/type/dataTypes";

interface StudentOngoingClassPageMobileProps {
  day: string;
  date: string;
  wordsToLearn: string[];
  wordJourneys: string[];
  attemptData: LessonWordAttempt[];
  goToLesson: () => void;
}
const StudentOngoingClassPageMobile = ({
  day,
  date,
  wordsToLearn,
  wordJourneys,
  attemptData,
  goToLesson,
}: StudentOngoingClassPageMobileProps) => {
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
      className='w-full pb-2 min-h-screen'
      style={{
        backgroundImage: `url(${Waterfall})`,
        backgroundSize: "cover",
        backgroundPosition: "right bottom",
        backgroundAttachment: "fixed",
      }}
    >
      <OngoingClassHeader day={day} date={date} />
      <div className='ml-7'>
        <div className='font-bold text-xl mt-3.5'>Words to Learn</div>
        <div className='flex flex-wrap relative gap-5'>
          {wordsToLearn.map((wordToLearn) => (
            <WordToLearn word={wordToLearn} key={wordToLearn} />
          ))}
        </div>
      </div>
      <div className='font-bold text-xl mt-3.5 ml-7'>Today&apos;s Journey</div>
      <div className='z-10 mb-20'>
        <div className='flex flex-col justify-center ml-5'>
          {wordJourneys.map((wordJourney, index) => (
            <React.Fragment key={index}>
              <WordJourney
                word={wordJourney}
                attemptData={getAttemptData(index)}
              />
            </React.Fragment>
          ))}
        </div>
        <div className='mt-8 mr-8 flex justify-end'>
          <SolidButton
            disabled={isCompleted}
            onClick={goToLesson}
            content={isCompleted ? "Lesson Completed" : "Let's Begin"}
            width={20}
          />
        </div>
      </div>
    </Box>
  );
};

export default StudentOngoingClassPageMobile;
