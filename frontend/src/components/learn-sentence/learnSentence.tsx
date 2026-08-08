import { useEffect, useState } from "react";
import MarkPopup from "./markPopup/markPopup";
import HandIcon from "@material-ui/icons/PanToolOutlined";
import { useRecoilState } from "recoil";
import JourneyAudio from "../journey-audio/JourneyAudio";
import {
  disableRightButtonSelector,
  maxProgressSelector,
  progressSelector,
} from "@recoil/journey";
import { Progress } from "@base/type/lessonJourney";

interface LearnSentenceProps {
  audio?: string | undefined;
  word: string;
  isPastStage?: boolean;
  onLoad?: (currentProgress?: Progress, maxProgress?: Progress) => void;
}

const LearnSentence = ({
  audio,
  word,
  isPastStage = false,
  onLoad,
}: LearnSentenceProps) => {
  const [sentence, setSentence] = useState("");
  const [markPopup, setMarkPopup] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] =
    useRecoilState(progressSelector);
  const [maxProgress, setMaxProgress] = useRecoilState(maxProgressSelector);

  useEffect(() => {
    onLoad && onLoad(currentProgress, maxProgress);
  }, []);

  const handleSentence = (event: any) => {
    setSentence(event.target.value);
  };

  const handleMarkPopupClose = () => {
    setMarkPopup(false);
  };

  const isSentenceEmpty = sentence.trim() === "";

  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  const markCorrect = () => {
    setIsRightButtonDisabled(false);
  };

  useEffect(() => {
    if (isPastStage) {
      setIsRightButtonDisabled(false);
    } else {
      setIsRightButtonDisabled(true);
    }
  }, [isPastStage]);

  return (
    <div className='w-screen h-full flex flex-col justify-start'>
      <div className='absolute end-1 top-2 flex flex-col items-center justify-center'>
        {audio && <p className='text-center'>Hear how it sounds</p>}
        {audio && <JourneyAudio audio={audio} />}
      </div>
      <div className='text-center text-xl text-textPrimary flex justify-center h-2/5'>
        <p className='text-subHeader font-bold'>
          Write a sentence with{" "}
          <span className='text-commonBlack'>&quot;{word}&quot;</span>
        </p>
      </div>

      <div className='text-center'>
        <textarea
          value={sentence}
          onChange={handleSentence}
          className='whitespace-pre-wrap w-1/2 h-40 text-xl text-justify rounded-xl text-top'
        />
      </div>
      <div className='absolute bottom-24 right-6'>
        {isRightButtonDisabled && (
          <button
            className={`${
              isSentenceEmpty ? "bg-slate-200" : "bg-purple-500"
            } text-white rounded-md px-2 py-1`}
            onClick={() => setMarkPopup(true)}
            disabled={isSentenceEmpty} // Disable the button if the sentence is empty
          >
            <HandIcon className='p-1' style={{ color: "white" }} />
            Mark
          </button>
        )}
        <MarkPopup
          hidden={!markPopup}
          onClose={handleMarkPopupClose}
          onCorrect={markCorrect}
        />
      </div>
    </div>
  );
};
export default LearnSentence;
