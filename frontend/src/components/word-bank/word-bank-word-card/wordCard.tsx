import { Typography } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";

import { ReactComponent as CancelIcon } from "assets/Cancel.svg";

interface WordCardProps {
  wordId: string;
  word: string;
  sentence: string;
  onCancel: (studentId: string) => void;
}

const WordCard = ({ wordId, word, sentence, onCancel }: WordCardProps) => {
  return (
    <div className='bg-white rounded w-fit p-2 flex flex-row gap-2 justify-start'>
      <div
        className='flex flex-col'
        style={{ minWidth: "120px", minHeight: "70px", maxWidth: "120px" }}
      >
        <Typography
          variant='caption'
          className='font-bold'
          sx={{ color: "#ABABAB" }}
        >
          {word}
        </Typography>
        <Typography variant='caption' sx={{ color: "#ABABAB" }}>
          {sentence}
        </Typography>
      </div>
      <SvgIcon
        component={CancelIcon}
        viewBox='0 0 14 14'
        sx={{ width: "14px" }}
        onClick={() => onCancel(wordId)}
      />
    </div>
  );
};

export default WordCard;
