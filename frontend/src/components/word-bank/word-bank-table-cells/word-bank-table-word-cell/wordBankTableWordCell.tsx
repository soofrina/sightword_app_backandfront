import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import { useRef } from "react";
import WordBankAudioPlayer from "../../word-bank-audio-player";

interface WordBankTableWordCellProps {
  word: string;
  audioPath: string;
}

const WordBankTableWordCell = ({
  word,
  audioPath,
}: WordBankTableWordCellProps) => {
  return (
    <div className='grid grid-cols-8 w-full'>
      <div className='col-span-6 mt-0.5'>{word}</div>
      <div className='col-span-2'>
        <WordBankAudioPlayer audioPath={audioPath} />
      </div>
    </div>
  );
};

export default WordBankTableWordCell;
