import { useState } from "react";

import SearchBar from "@components/search-bar/searchBar";
import AppSelect from "@components/app-select/AppSelect";
import AppButton from "@components/app-button/appButton";
import AddIcon from "@mui/icons-material/Add";
import WindowIcon from "@mui/icons-material/Window";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import RestoreFromTrashOutlinedIcon from "@mui/icons-material/RestoreFromTrashOutlined";

import { DropdownVariant, DropdownColor } from "@base/type/appDropdown";
import { DifficultyLevel, sortingOptions } from "@base/type/wordBank";
import { OptionData } from "@base/type/appSelect";

const difficultyLevels = [
  { id: 1, name: DifficultyLevel.ShowAll, value: DifficultyLevel.ShowAll },
  { id: 2, name: DifficultyLevel.Basic, value: DifficultyLevel.Basic },
  {
    id: 3,
    name: DifficultyLevel.Intermediate,
    value: DifficultyLevel.Intermediate,
  },
  { id: 4, name: DifficultyLevel.Advanced, value: DifficultyLevel.Advanced },
];

interface WordBankTableHeaderProps {
  searchFilterFunction: (searchText: string) => void;
  difficultyFilterFunction: (difficultyLevel: DifficultyLevel) => void;
  handleSetGridMode: () => void;
  isShowGrid: boolean;
  onGridSort: (option: OptionData) => void;
  showAltControl: boolean;
  onShowDeletePopup: () => void;
  onAddWord: () => void;
}

const WordBankTableHeader = ({
  searchFilterFunction,
  difficultyFilterFunction,
  isShowGrid,
  handleSetGridMode,
  onGridSort,
  showAltControl,
  onShowDeletePopup,
  onAddWord,
}: WordBankTableHeaderProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel>(
    DifficultyLevel.ShowAll,
  );

  return (
    <div className='bg-[#FAF9F6] rounded grid-cols-4 grid content-center px-12 h-16 border-b'>
      <div>
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => searchFilterFunction(searchText)}
          className='h-9 bg-white'
          placeholder='Search'
        />
      </div>
      <div className='grid grid-cols-7'>
        <div className='col-span-2 grid content-center mb-0.5 text-secondaryContrastText'>
          Difficulty
        </div>
        <div className='col-span-5'>
          <AppSelect
            dropdownVariant={DropdownVariant.GHOST}
            dropdownColor={DropdownColor.SECONDARY}
            data={difficultyLevels}
            onChange={(e) => {
              setDifficultyFilter(e.value as DifficultyLevel);
              difficultyFilterFunction(e.value as DifficultyLevel);
            }}
            value={
              difficultyLevels.find(
                (level) => level.value === difficultyFilter,
              ) ?? difficultyLevels[0]
            }
          />
        </div>
      </div>
      <div className='grid grid-cols-7 ml-3'>
        {isShowGrid && (
          <>
            <div className='col-span-1 grid content-center mb-0.5 text-secondaryContrastText'>
              Sort
            </div>
            <div className='col-span-6'>
              <AppSelect
                className='w-24 ml-1'
                dropdownVariant={DropdownVariant.GHOST}
                dropdownColor={DropdownColor.SECONDARY}
                data={sortingOptions}
                value={sortingOptions[0]}
                onChange={onGridSort}
              />
            </div>
          </>
        )}
      </div>
      <div className='justify-self-end'>
        {isShowGrid ? (
          <ViewListOutlinedIcon
            onClick={handleSetGridMode}
            className='text-secondaryContrastText text-3xl mr-3 cursor-pointer'
          />
        ) : (
          <WindowIcon
            onClick={handleSetGridMode}
            className='text-secondaryContrastText text-3xl mr-3 cursor-pointer mt-1'
          />
        )}
        {showAltControl ? (
          <RestoreFromTrashOutlinedIcon
            onClick={onShowDeletePopup}
            className='text-primaryMain text-3xl cursor-pointer mt-1'
          />
        ) : (
          <AppButton onClick={onAddWord} startIcon={<AddIcon />}>
            Add Word
          </AppButton>
        )}
      </div>
    </div>
  );
};

export default WordBankTableHeader;
