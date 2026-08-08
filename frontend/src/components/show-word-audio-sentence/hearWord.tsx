import { useEffect } from "react";
import JourneyAudio from "../journey-audio/JourneyAudio";
import {
  disableRightButtonSelector,
  maxProgressSelector,
  progressSelector,
} from "@recoil/journey";
import { useRecoilState } from "recoil";
import { Progress } from "@base/type/lessonJourney";

interface HearWordProps {
  word: string;
  sentence: string;
  audio?: string;
  image?: string;
  header?: string;
  isPastStage?: boolean;

  onLoad?: (currentProgress?: Progress, maxProgress?: Progress) => void;

  // deprecated
  audios?: string[] | undefined;
  images?: string[] | undefined;
}

const HearWord = ({
  word,
  sentence,
  header,
  audio,
  image,
  onLoad,
  isPastStage,
}: HearWordProps) => {
  const [_, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );
  const [currentProgress, setCurrentProgress] =
    useRecoilState(progressSelector);
  const [maxProgress, setMaxProgress] = useRecoilState(maxProgressSelector);

  useEffect(() => {
    onLoad && onLoad(currentProgress, maxProgress);
  }, []);

  useEffect(() => {
    if (isPastStage) {
      setIsRightButtonDisabled(false);
    }
  }, [isPastStage]);

  return (
    <div>
      {header && (
        <p className='text-center font-bold text-subHeader text-lg'>{header}</p>
      )}
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='flex flex-col mb-20 w-2/5 items-end'>
          <div className='ml-8'>
            <p className='text-commonBlack font-bold text-4xl capitalize'>
              {word}
            </p>
            <p className='italic text-textSecondary text-xl'>
              &quot;{sentence}&quot;
            </p>
            <p className='mt-5 text-subLine'>Hear how it sounds</p>
            <JourneyAudio audio={audio} />
          </div>
        </div>
        <div className='flex justify-center w-3/5'>
          <img
            src={image}
            className='mb-20 max-h-40 max-w-40 aspect-auto rounded-xl'
          />
        </div>
      </div>
    </div>
  );
};
export default HearWord;
