/* eslint-disable @typescript-eslint/no-empty-function */
import { Card, ClickAwayListener, Modal } from "@mui/material";
import { DifficultyLevel } from "@base/type/wordBank";
import DifficultyChip from "@base/components/word-bank/word-bank-grid-view/word-bank-grid-card/difficultyChip";
import { useState } from "react";
import GridCard from "@base/components/word-bank/word-bank-grid-view/word-bank-grid-card/gridCard";
import { WordBankGridCard } from "../word-bank-page/wordBankPage";
import { Box } from "@mui/system";

export interface WordListCardProps {
  id: string;
  wordFilter: string;
  difficulty: DifficultyLevel;
  sentence: string;
  lastReviewedFilter: Date | null;
  imagePath: string;
  audioPath: string;
  onClickLearn?: () => void;
  onClickQuiz?: () => void;
}

const WordListCard = ({
  id,
  wordFilter,
  difficulty,
  sentence,
  lastReviewedFilter,
  imagePath,
  onClickQuiz,
  onClickLearn,
  audioPath,
}: WordListCardProps) => {
  const [isCardVisible, setIsCardVisible] = useState(false);

  const handleQuiz = () => {
    // open review card
    onClickQuiz && onClickQuiz();
  };

  const handleLearn = () => {
    // redirect to learn
    onClickLearn && onClickLearn();
  };

  const wordCard: WordBankGridCard = {
    id: id,
    word: wordFilter,
    difficulty: difficulty,
    sentence: sentence,
    lastReviewed: lastReviewedFilter,
    imagePath: imagePath,
    audioPath: audioPath,
  };

  return (
    <Card
      onClick={() => setIsCardVisible(true)}
      className='hover:cursor-pointer p-3 w-full my-2'
    >
      <div className='flex'>
        <div className='w-4/5'>
          <div className='flex'>
            <p className='font-bold mr-2'>{wordFilter}</p>
            <DifficultyChip difficulty={difficulty} />
          </div>
          <p className='italic text-xs'>
            Last reviewed:{" "}
            {lastReviewedFilter
              ? lastReviewedFilter.toLocaleDateString()
              : "--"}
          </p>
        </div>
        <div className='w-1/5'>
          {onClickLearn && (
            <p
              className='hover:cursor-pointer underline text-primaryMain dark:text-primaryMain-d'
              onClick={handleLearn}
            >
              Learn
            </p>
          )}
          {onClickQuiz && (
            <p
              className='hover:cursor-pointer underline text-infoDark dark:text-infoDark-d'
              onClick={handleQuiz}
            >
              Quiz
            </p>
          )}
        </div>
      </div>
      {isCardVisible && (
        <ClickAwayListener onClickAway={() => setIsCardVisible(false)}>
          <Box className='absolute z-99'>
            <GridCard data={[wordCard]} className='relative z-1000' />
          </Box>
        </ClickAwayListener>
      )}
    </Card>
  );
};

export default WordListCard;
