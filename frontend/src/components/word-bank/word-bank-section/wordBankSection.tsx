import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WordItem from "@components/word-item/wordItem";
import { WordBankWord } from "@base/type/dataTypes";

interface WordBankSectionProps {
  placeholderText?: string;
  isAddMode?: boolean;
  icon: string;
  words?: WordBankWord[];
  hasSearch?: boolean;
  addWord?: (wordId: string) => void;
  removeWord?: (wordId: string) => void;
}

const WordBankSection = ({
  placeholderText = "Search",
  isAddMode,
  icon,
  words = [],
  addWord,
  removeWord,
  hasSearch = false,
}: WordBankSectionProps) => {
  const [searchText, setSearchText] = useState<string>("");

  const filteredWords: WordBankWord[] = words.filter((item) =>
    item.word.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className='flex flex-col w-1/2 h-60 px-5 rounded-lg'>
      {hasSearch && (
        <Autocomplete
          options={words.map((w) => w.word)}
          value={searchText}
          onChange={(event, newValue) => {
            setSearchText(newValue || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholderText}
              className='ml-2 w-64 outline-none placeholder=${placeholderText} placeholder:italic hover:shadow-xl hover:outline-none focus:outline-none focus:border-none focus:text-black'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon color='inherit' sx={{ mr: 1 }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
      <div className='flex flex-wrap mt-5 overflow-y-auto'>
        {filteredWords.map((word, index) => {
          return (
            <WordItem
              key={`word-bank-section-wordItem-${index}`}
              word={word.word}
              isAddMode={isAddMode}
              icon={icon}
              onClickIcon={() =>
                isAddMode
                  ? addWord && addWord(word.wordId)
                  : removeWord && removeWord(word.lessonWordId)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default WordBankSection;
