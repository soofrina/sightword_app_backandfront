import { LessonWordData } from "@base/type/dataTypes";
import { toastWrong } from "@base/utility/toast";
import {
  disableRightButtonSelector,
  disableLeftButtonSelector,
  scoreSelector,
} from "@recoil/journey";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

interface FillGapsProps {
  isQuiz?: boolean;
  word: string;
  wordIdx?: number;
  sentence: string;
  isPastStage?: boolean;
  wordAttemptId?: string;
  onLoad?: () => void;
}

const FillGaps = ({
  word,
  wordIdx,
  sentence,
  isQuiz = false,
  isPastStage = false,
  wordAttemptId,
  onLoad,
}: FillGapsProps) => {
  const [input, setInput] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useRecoilState(
    disableLeftButtonSelector,
  );

  const [scores, setScores] = useRecoilState(scoreSelector);

  const altered = sentence.split(word);

  const handleInput = (event: any) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    onLoad && onLoad();
  }, []);

  useEffect(() => {
    if (isPastStage) {
      setIsLeftButtonDisabled(false);
      setIsRightButtonDisabled(false);
    }
  }, [isPastStage]);

  const wordStartIdx = sentence.toLowerCase().indexOf(word.toLowerCase());
  // get part of sentence before the word
  const sentencePrefix = sentence.substring(0, wordStartIdx);
  // get part of sentence after the word
  const sentenceSuffix = sentence.substring(
    wordStartIdx + word.length,
    sentence.length,
  );

  const parts: any[] = [];
  altered.forEach((part, index) => {
    parts.push(part);
    if (index < altered.length - 1) {
      parts.push(
        <input
          className='rounded-sm w-40 text-3xl outline-slate-500 text-center font-bold'
          key={index}
          type='text'
          value={input}
          onChange={handleInput}
        />,
      );
    }
  });

  const submitAnswer = () => {
    if (wordIdx === undefined) {
      toastWrong("Something went wrong");
      return;
    }

    const isWordCorrect = word?.toLowerCase() === input.toLowerCase();

    const scoresCopy = [...scores];
    const currentWordScore = scoresCopy[wordIdx];
    if (isWordCorrect) {
      scoresCopy[wordIdx] = { ...currentWordScore, scoreTwo: 1 };
    } else {
      scoresCopy[wordIdx] = { ...currentWordScore, scoreTwo: 0 };
    }
    setScores(scoresCopy);

    toast.info("Answer Submitted", {
      position: "bottom-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setIsAnswerSubmitted(true);
    setIsRightButtonDisabled(false);
  };

  useEffect(() => {
    // always disable buttons for quiz to prevent forward and backward navigation before submit
    if (isQuiz) {
      setIsLeftButtonDisabled(true);
      setIsRightButtonDisabled(true);
    }
  }, [isQuiz]);

  return (
    <div className='flex flex-col items-center justify-start w-screen h-screen'>
      <div className='text-center text-textSecondary font-bold text-2xl w-full'>
        Word {wordIdx ? wordIdx + 1 : 1} - Fill In The Gaps!
      </div>
      <div className='flex items-center justify-center w-full h-full'>
        <p className='text-center text-black text-2xl font-bold mb-20'>
          {sentencePrefix}
          <input
            disabled={isAnswerSubmitted}
            className='rounded-sm w-40 text-3xl outline-slate-500 text-center font-bold'
            type='text'
            value={input}
            onChange={handleInput}
          />
          {sentenceSuffix}
        </p>
      </div>
      <div className='absolute right-8 bottom-24'>
        <button
          onClick={submitAnswer}
          className={`pointer ${(!isQuiz || isAnswerSubmitted) && "hidden"} ${
            input.length === 0 ? "bg-slate-200" : "bg-primaryMain"
          } text-white rounded-md px-2 py-1`}
          disabled={input.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FillGaps;
