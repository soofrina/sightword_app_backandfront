import { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import JourneyAudio from "../journey-audio/JourneyAudio";
import { disableRightButtonSelector } from "@recoil/journey";

interface WordCloudProps {
  audio?: string | undefined;
  word: string;
  isPastStage?: boolean;
  onLoad?: () => void;
}

const WordCloud = ({
  audio,
  word,
  isPastStage = false,
  onLoad,
}: WordCloudProps) => {
  const [_, setIsRightButtonDisabled] = useRecoilState(
    disableRightButtonSelector,
  );

  const numCorrectWords = 3;

  const [selectedWords, setSelectedWords] = useState<{
    [key: string]: boolean | undefined;
  }>({});

  useEffect(() => {
    onLoad && onLoad();
  }, []);

  useEffect(() => {
    if (isPastStage) {
      setIsRightButtonDisabled(false);
    } else {
      setIsRightButtonDisabled(true);
    }
  }, [isPastStage]);

  const findPermutations = (str: string, maxPermutations: number): string[] => {
    if (str.length <= 1) return [str];
    if (str.length === 2)
      return str.length === 2 ? [str, str[1] + str[0]] : [str];

    const res = str
      .split("")
      .reduce((acc: string[], letter: string, i: number) => {
        if (acc.length >= maxPermutations) return acc;
        const remainingChars = str.slice(0, i) + str.slice(i + 1);
        const permutations = findPermutations(
          remainingChars,
          maxPermutations - acc.length,
        );
        return acc.concat(permutations.map((val: string) => letter + val));
      }, []);

    return res.slice(0, maxPermutations);
  };

  const permutatedArray = findPermutations(word, 10);

  const words = [];

  const uniquePermutations = permutatedArray.filter((element, index) => {
    return permutatedArray.indexOf(element) === index;
  });

  for (let i = 0; i < Math.min(uniquePermutations.length, 10); i++) {
    const word = { id: i, text: uniquePermutations[i], value: 1 };
    words.push(word);
  }

  for (let i = 0; i < numCorrectWords - 1; i++) {
    const spaces = " ".repeat(i + 1);
    const correctWords = {
      id: uniquePermutations.length + i,
      text: word + spaces,
      value: 1,
    };
    words.push(correctWords);
  }

  const showWrongPopup = () => {
    toast.error("Uh-oh... That’s not quite right.", {
      position: "bottom-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showCorrectPopup = () => {
    toast.success("Great Job! Can you find more?", {
      position: "bottom-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleWordClick = (clickedWord: { text: string }) => {
    if (clickedWord.text.trim() === word) {
      setSelectedWords((prevSelectedWords) => {
        if (
          Object.values(prevSelectedWords).filter((value) => value).length === 0
        ) {
          return { [clickedWord.text]: true };
        } else {
          return {
            ...prevSelectedWords,
            [clickedWord.text]: true,
          };
        }
      });
      showCorrectPopup();
    } else {
      setSelectedWords({ [clickedWord.text]: false });
      showWrongPopup();
    }
  };

  const getWordColor = (currentWord: { text: string }) => {
    if (selectedWords[currentWord.text]) {
      return "green";
    } else if (selectedWords[currentWord.text] === false) {
      return "red";
    } else {
      return "black";
    }
  };

  const options: any = {
    rotations: 0,
    deterministic: true,
    fontSizes: [16, 60],
    padding: 2,
    fontFamily: "Helvetica",
  };

  const callbacks = {
    getWordColor: getWordColor,
    onWordClick: handleWordClick,
    getWordTooltip: () => {
      return undefined;
    },
  };

  const areAllValuesTrue =
    Object.values(selectedWords).filter((value) => value).length ===
    numCorrectWords;

  useEffect(() => {
    if (!areAllValuesTrue) {
      return;
    }
    setIsRightButtonDisabled(false);
    toast.success(
      "Great job! \n Tap on the next button on the right to continue.",
      {
        position: "bottom-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      },
    );
  }, [areAllValuesTrue]);

  return (
    <div className='w-screen'>
      <div className='absolute end-1 top-2 flex flex-col items-center justify-center'>
        {audio && <p className='text-center'>Hear how it sounds</p>}
        {audio && <JourneyAudio audio={audio} />}
      </div>
      <ReactWordcloud words={words} callbacks={callbacks} options={options} />
    </div>
  );
};

export default WordCloud;
