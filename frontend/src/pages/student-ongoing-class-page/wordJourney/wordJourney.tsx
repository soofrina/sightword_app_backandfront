import {
  ImageApprovalStatus,
  LessonWordAttempt,
  WordAttemptProgress,
} from "@base/type/dataTypes";
import { useState } from "react";
import { ReactComponent as Flower } from "../../student-home-page/flower.svg";
import Journey from "./journey/journey";
import { ReactComponent as ProgressLine } from "./progressLine.svg";

type WordJourneyProps = {
  word: string;
  attemptData: LessonWordAttempt | null;
  isChangeRequired?: boolean; // new prop for change required
};

export const WordJourney = ({ word, attemptData }: WordJourneyProps) => {
  const isCompleted = (progress: string) => {
    const order = [
      "Show",
      "Learn",
      "Personalisation",
      "Recall",
      "Quiz",
      "Completed",
    ];
    const currentIdx = order.indexOf(progress);
    const attemptIdx = order.indexOf(attemptData?.progress ?? "");

    // If the progress is either "Quiz" or "Completed", mark all as completed
    if (
      attemptData?.progress === WordAttemptProgress.QUIZ ||
      attemptData?.progress === WordAttemptProgress.COMPLETED
    ) {
      return true;
    }

    return attemptIdx >= currentIdx;
  };

  return (
    <>
      {word === "End" ? (
        <div className='flex flex-row bg-neutral-50 rounded-md w-80 h-14'>
          <Flower className='ml-4 self-center' />
          <div className='self-center ml-2.5'>{word}</div>
        </div>
      ) : word === "Quiz" ? (
        <>
          <div className='flex flex-row bg-neutral-50 rounded-md w-80 h-14'>
            <Flower className='ml-4 self-center' />
            <div className='self-center ml-2.5'>{word}</div>
          </div>
          <ProgressLine className='ml-7' />
        </>
      ) : (
        <>
          <div className='flex flex-row bg-neutral-50 rounded-md w-80 h-14'>
            <Flower className='ml-4 self-center' />
            <div className='self-center ml-2.5'>{word}</div>
          </div>
          <ProgressLine className='ml-7' />
          <div className='ml-6'>
            <Journey word='Show' isCompleted={isCompleted("Show")} />
          </div>
          <ProgressLine className='ml-7' />
          <div className='ml-6'>
            <Journey word='Learn' isCompleted={isCompleted("Learn")} />
          </div>
          <ProgressLine className='ml-7' />
          <div className='ml-6'>
            <Journey
              word='Personalise'
              isCompleted={isCompleted("Personalisation")}
              isChangeRequired={
                attemptData?.imageApprovalStatus ===
                ImageApprovalStatus.REJECTED
              }
            />
          </div>
          <ProgressLine className='ml-7' />
          <div className='ml-6'>
            <Journey word='Recall' isCompleted={isCompleted("Recall")} />
          </div>
          <ProgressLine className='ml-7' />
        </>
      )}
    </>
  );
};

export default WordJourney;
