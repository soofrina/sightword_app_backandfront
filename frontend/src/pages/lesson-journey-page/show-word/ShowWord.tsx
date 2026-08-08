import { disableRightButtonSelector } from "@recoil/journey";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

interface ShowWordProps {
  // for header
  stage: number;

  // word user is learning
  word: string;

  onLoad?: () => void;
}

const ShowWord = ({ stage = -1, word, onLoad }: ShowWordProps) => {
  useEffect(() => {
    onLoad && onLoad();
  }, []);

  type wordLabelMap = {
    [key: number]: string;
  };

  const wordLabel: wordLabelMap = {
    0: "first",
    1: "second",
    2: "third",
    3: "fourth",
    4: "fifth",
    5: "sixth",
    6: "seventh",
  };

  const getWordLabel = (stage: number): string => {
    // check int and between 0-6
    if (Number.isInteger(stage) && stage >= 0 && stage <= 6) {
      return wordLabel[stage];
    }
    return "next";
  };

  const [isRightButtonDisabled, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  useEffect(() => {
    setIsRightButtonDisabled(false);
  }, []);

  return (
    <div className='flex flex-col items-center h-full'>
      <p className='uppercase text-subHeader font-bold text-xl h-1/5'>{`Today's ${getWordLabel(
        stage,
      )} word`}</p>
      <div className='flex flex-row items-center h-4/5'>
        <p className='text-7xl font-bold'>{word}</p>
      </div>
    </div>
  );
};

export default ShowWord;
