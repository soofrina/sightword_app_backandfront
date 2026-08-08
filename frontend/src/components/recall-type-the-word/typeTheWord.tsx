import audioImg from "@base/assets/audio.jpg";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  disableLeftButtonSelector,
  disableRightButtonSelector,
  scoreSelector,
} from "@recoil/journey";
import { Close, HelpOutline } from "@material-ui/icons";
import HelpPopup from "../help-popup/HelpPopup";
import { toastCorrect, toastWrong } from "@base/utility/toast";
import JourneyAudio from "../journey-audio/JourneyAudio";
import { toast } from "react-toastify";
import { QuizScore } from "@base/type/lessonJourney";
import { hideHintPermanentState } from "@recoil/journey/hintAtom";

interface TypeTheWordProps {
  isQuiz?: boolean;
  wordIdx?: number;
  word: string | undefined;
  image: string | undefined;
  audio: string | undefined;
  isPastStage?: boolean;
  wordAttemptId?: string;
  onLoad?: () => void;
}

interface HintPopupProps {
  className?: string;
  hint: string;
  onClose?: () => void;
}

const HintPopup = ({
  hint,
  onClose = () => undefined,
  className,
}: HintPopupProps) => {
  return (
    <div
      className={`absolute bg-commonWhite rounded text-commonBlack px-5 py-12 text-left shadow ${className}`}
    >
      <Close
        className='absolute right-2 top-2 text-errorMain'
        onClick={onClose}
      />
      <p className='font-bold text-base'>Hint</p>
      <p className='text-sm'>{hint}</p>
    </div>
  );
};

const TypeTheWord = ({
  word,
  isQuiz = false,
  wordIdx,
  image,
  audio,
  isPastStage,
  wordAttemptId,
  onLoad,
}: TypeTheWordProps) => {
  const [count, setCount] = useState(1);
  const [input, setInput] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useRecoilState(
    disableLeftButtonSelector,
  );
  const [isHintHelperHidden, setIsHintHelperHidden] = useRecoilState(
    hideHintPermanentState,
  );

  // TODO: Uncomment once done with development
  // const [maxAttempts, setMaxAttempts] = useState(isQuiz ? 1 : 3);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [showStartPopup, setShowStartPopup] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [scores, setScores] = useRecoilState(scoreSelector);

  useEffect(() => {
    onLoad && onLoad();
  }, [scores]);

  const handleWord = (event: any) => {
    setInput(event.target.value);
  };

  const submitAnswer = () => {
    if (wordIdx === undefined) {
      toastWrong("Something went wrong");
      return;
    }

    const isWordCorrect = word?.toLowerCase() === input.toLowerCase();
    const scoresCopy = [...scores];
    const newScore: QuizScore = { scoreOne: 0, scoreTwo: 0 };
    if (isWordCorrect) {
      newScore.scoreOne = 1;
    }

    if (wordAttemptId) {
      newScore.wordAttemptId = wordAttemptId;
    }

    setScores([...scoresCopy, newScore]);

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
    if (isPastStage) {
      setIsLeftButtonDisabled(false);
      setIsRightButtonDisabled(false);
      return;
    }

    // disable navigation buttons for quiz
    if (isQuiz) {
      setIsLeftButtonDisabled(true);
      setIsRightButtonDisabled(true);
      return;
    }

    // if not quiz and not past stage, disable next and allow previous
    setIsLeftButtonDisabled(false);
    setIsRightButtonDisabled(true);
  }, [isQuiz, isPastStage]);

  const verifyWord = () => {
    const isWordCorrect = word?.toLowerCase() === input.toLowerCase();
    if (isWordCorrect) {
      if (count < maxAttempts) {
        setCount(count + 1);
        setInput("");
        toastCorrect(
          `Good Job! Let's type the word ${maxAttempts - count} more time(s)!`,
        );
      } else {
        setIsRightButtonDisabled(false);
        toastCorrect();
      }
    } else {
      toastWrong(
        "Uh-oh, That is not quite right. \n Try again or toggle back to review the word!",
      );
    }
  };

  const onCloseHelpPopup = (hidePermanent: boolean) => {
    setShowStartPopup(false);

    if (hidePermanent) {
      setIsHintHelperHidden(true);
    }
  };

  const isWordEmpty = input.trim() === "";

  return (
    <div className='flex flex-col items-center w-screen h-screen'>
      <p className='text-center text-textSecondary font-bold text-2xl w-full'>
        {/* for quiz, include this prefix */}
        {isQuiz && wordIdx !== undefined ? "Word " + (wordIdx + 1) + "- " : ""}
        Type The Word
        {isQuiz && (
          <HelpOutline
            onClick={() => setShowHelp(true)}
            className='text-primaryMain ml-2 cursor-pointer'
          />
        )}
        {!isHintHelperHidden && isQuiz && showStartPopup && wordIdx === 0 && (
          <HelpPopup
            className='absolute flex w-screen ml-20 justify-center items-center text-sm'
            actionText='Got it!'
            onClose={onCloseHelpPopup}
            message={
              <p>
                Click on the <HelpOutline className='text-primaryMain' /> for
                hints
              </p>
            }
          />
        )}
        {isQuiz && showHelp && (
          <div className='absolute flex w-screen h-screen pb-32 justify-center items-center'>
            <HintPopup
              hint={`The word has ${word?.length} letters.`}
              onClose={() => setShowHelp(false)}
            />
          </div>
        )}
        {/* for not quiz, include the counts */}
        {!isQuiz && (
          <>
            <p className='bg-primaryMain text-white rounded-md mx-2 h-8 w-8 inline-block text-center'>
              {count}
            </p>
            /3 Times
          </>
        )}
      </p>
      <div className='flex items-center justify-center w-full max-w-screen-lg h-1/3'>
        <img src={image} className='ml-40 h-2/3 aspect-auto rounded-xl' />
        <div className='flex flex-col items-start justify-center ml-6 mr-24'>
          <p className='text-center'>Hear how it sounds</p>
          <JourneyAudio audio={audio} />
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <textarea
          disabled={isAnswerSubmitted}
          value={input}
          onChange={handleWord}
          className='whitespace-pre-wrap w-1/2 mb-10 h-16 text-5xl text-justify rounded-xl text-top'
          style={{ height: "40vh" }}
        />
        <div className='absolute right-8 bottom-24'>
          <button
            onClick={verifyWord}
            className={`pointer ${isQuiz && "hidden"} ${
              isWordEmpty ? "bg-slate-200" : "bg-primaryMain"
            } text-white rounded-md px-2 py-1`}
            disabled={isWordEmpty}
          >
            Verify
          </button>
          <button
            onClick={submitAnswer}
            className={`pointer ${(!isQuiz || isAnswerSubmitted) && "hidden"} ${
              isWordEmpty ? "bg-slate-200" : "bg-primaryMain"
            } text-white rounded-md px-2 py-1`}
            disabled={isWordEmpty}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeTheWord;
