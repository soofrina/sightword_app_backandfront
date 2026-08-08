import { useEffect, useRef, useState } from "react";
import DrawingField from "../drawing-field/drawingField";
import { useRecoilState } from "recoil";
import MarkPopup from "../learn-sentence/markPopup/markPopup";
import HandIcon from "@material-ui/icons/PanToolOutlined";
import JourneyAudio from "../journey-audio/JourneyAudio";
import { disableRightButtonSelector } from "@recoil/journey/selector";

interface TraceWordProps {
  audio?: string | undefined;
  word: string;
  isRecall?: boolean;
  isPastStage?: boolean;
  onLoad?: () => void;
}

interface DrawingRef extends React.MutableRefObject<any> {
  saveDrawing: () => string;
  resetCanvas(): void;
}

const TraceWord = ({
  audio,
  word,
  isRecall = false,
  isPastStage = false,
  onLoad,
}: TraceWordProps) => {
  const MAX_ATTEMPTS = 1;
  const INITIAL_ATTEMPTS = 1;
  const [attempts, setAttempts] = useState(INITIAL_ATTEMPTS);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );
  const [correctMsg, setCorrectMsg] = useState("");
  const [markPopup, setMarkPopup] = useState<boolean>(false);
  const [isStageDone, setIsStageDone] = useState<boolean>(false);
  const drawingRef = useRef<DrawingRef | null>(null);

  useEffect(() => {
    onLoad && onLoad();
  }, []);

  // control correct and wrong msg
  useEffect(() => {
    // if past stage or stage is done, unhide right button
    if (isPastStage || isStageDone) {
      // use default
      setCorrectMsg("");
      setIsRightButtonDisabled(false);
    } else {
      setIsRightButtonDisabled(true);
      if (attempts < MAX_ATTEMPTS) {
        setCorrectMsg(
          `Great Job! Trace the word ${MAX_ATTEMPTS - attempts} more times!`,
        );
      } else {
        setCorrectMsg("Great job! \n Tap on the next button on the right.");
      }
    }
  }, [isStageDone, attempts]);

  const handleCorrect = () => {
    if (attempts < MAX_ATTEMPTS) {
      setAttempts(attempts + 1);
      drawingRef.current?.resetCanvas();
    } else {
      setIsStageDone(true);
    }
  };

  return (
    <div className='flex flex-col items-center h-full'>
      <p className='font-bold text-subHeader text-xl'>
        Trace{" "}
        {isRecall ? (
          "The Word"
        ) : (
          <span className='text-commonBlack'>&quot;{word}&quot;</span>
        )}{" "}
        <span className='bg-primaryMain py-1 px-2 rounded text-commonWhite'>
          {attempts}
        </span>
        /{MAX_ATTEMPTS} Times
      </p>
      <DrawingField
        className='mt-2 h-4/5 w-3/5'
        word={isRecall ? "" : word}
        ref={drawingRef}
      />
      {isRightButtonDisabled && (
        <button
          className='absolute bottom-24 end-10 bg-purple-500 text-white rounded-md px-2 py-1'
          onClick={() => setMarkPopup(true)}
        >
          <HandIcon className='p-1' style={{ color: "white" }} />
          Mark
        </button>
      )}
      {/* TODO: Fix Mark popup position on Desktop */}
      <MarkPopup
        className='bottom-24'
        hidden={!markPopup}
        onClose={() => setMarkPopup(false)}
        onCorrect={handleCorrect}
        correctMsg={correctMsg}
      />
      <div className='absolute end-1 top-2 flex flex-col items-center justify-center'>
        {audio && <p className='text-center'>Hear how it sounds</p>}
        {audio && <JourneyAudio audio={audio} />}
      </div>
    </div>
  );
};

export default TraceWord;
