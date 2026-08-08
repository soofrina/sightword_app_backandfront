import WordBankSection from "@components/word-bank/word-bank-section/wordBankSection";

import img from "@assets/wordBankEmpty.png";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllWords } from "@base/api/words";
import { useEffect, useState } from "react";
import { WordBankWord } from "@base/type/dataTypes";

interface WordBankProps {
  isVisible?: boolean;
  selectedWords?: WordBankWord[];
  rightHidden?: boolean;
  removeWord?: (id: string) => void;
  addWord?: (id: string) => void;

  disabled?: boolean;
  // if the word bank is disabled, display some text inside
  disabledText?: string;
}

const WordBank = ({
  isVisible,
  selectedWords = [],
  rightHidden,
  removeWord,
  addWord,
  disabled = false,
  disabledText,
}: WordBankProps) => {
  const [availableWords, setAvailableWords] = useState<WordBankWord[]>([]);

  const getWordsQuery = useQuery({
    queryKey: ["getWords"],
    retry: 3,
    queryFn: () => getAllWords(),
  });

  useEffect(() => {
    if (getWordsQuery.isSuccess) {
      const availableWords = getWordsQuery.data.data.filter(
        (word) =>
          !selectedWords.find(
            (selectedWord) => selectedWord.wordId === word.id,
          ),
      );
      setAvailableWords(
        availableWords.map((word) => ({
          lessonWordId: word.id,
          word: word.word,
          wordId: word.id,
        })),
      );
    }
  }, [getWordsQuery.isSuccess, selectedWords]);

  if (disabled) {
    return (
      <Box
        sx={{ backgroundColor: "background.paper" }}
        className='mx-12 flex justify-center items-center rounded-lg border-background border-2 border-dashed h-60'
      >
        <Typography
          sx={{ color: "text.secondary" }}
          className='font-bold text-3xl'
        >
          {disabledText}
        </Typography>
      </Box>
    );
  }

  if (!isVisible) {
    return (
      <Box
        sx={{ backgroundColor: "background.paper" }}
        className='mx-12 flex justify-center items-center rounded-lg border-background border-2 border-dashed h-60'
      >
        <div className='flex items-center'>
          <img className='h-32' src={img} />
          <Typography
            sx={{ color: "text.secondary" }}
            className='font-bold w-36'
          >
            Select a class to view its word bank
          </Typography>
        </div>
      </Box>
    );
  }
  return (
    <Box className='mx-12 mb-4 flex-col rounded-lg py-4 bg-backgroundPaper dark:bg-backgroundPaper-d border-background border-2 border-dashed'>
      <span className='ml-8 text-sublineText'>Current words</span>
      <Box className='flex w-full'>
        {selectedWords.length === 0 && (
          <p className='w-1/2 pt-8 pl-8'>No words selected.</p>
        )}
        {selectedWords.length > 0 && (
          <WordBankSection
            icon='remove'
            placeholderText='Search'
            words={selectedWords}
            removeWord={removeWord}
          />
        )}
        {!rightHidden && (
          <WordBankSection
            hasSearch
            isAddMode
            icon='add'
            placeholderText='Search Word Bank'
            words={availableWords}
            addWord={addWord}
          />
        )}
      </Box>
    </Box>
  );
};

export default WordBank;
