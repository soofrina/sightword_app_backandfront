import { DifficultyLevel } from "@base/type/wordBank";

interface WordChipProps {
  word: string;
  difficulty: DifficultyLevel;
}

type DifficultyColors = {
  [key in DifficultyLevel]: {
    backgroundColor: string;
    textColor: string;
  };
};

const difficultyColors: DifficultyColors = {
  [DifficultyLevel.ShowAll]: {
    backgroundColor: "",
    textColor: "",
  },
  [DifficultyLevel.Basic]: {
    backgroundColor: "bg-[#CAF3DE] dark:bg-[#2C4F2D]",
    textColor: "text-[#01BF5B]",
  },
  [DifficultyLevel.Intermediate]: {
    backgroundColor: "bg-[#f4cf8799] dark:bg-[#FFA00099]",
    textColor: "text-[#DD9A18] dark:text-[#FFC107]",
  },
  [DifficultyLevel.Advanced]: {
    backgroundColor: "bg-[#f4a29533]",
    textColor: "text-[#FF6D56]",
  },
};


const WordChip = ({ difficulty, word }: WordChipProps) => {
  return (
    <div
      className={`${difficultyColors[difficulty].backgroundColor} text-center rounded-full mb-2 inline-block px-4 pb-[2px]`}
    >
      <span
        className={`${difficultyColors[difficulty].textColor} text-[12px] font-medium`}
      >
        {word}
      </span>
    </div>
  );
};

export default WordChip;
