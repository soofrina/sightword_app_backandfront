import { useState, useEffect } from "react";

import Pagination from "@mui/material/Pagination";
import AppSelect from "@components/app-select";
import { OptionData } from "@base/type/appSelect";
import { DropdownColor, DropdownVariant } from "@base/type/appDropdown";

interface WordBankGridFooterProps {
  handleCardsPerPageChange: (data: OptionData) => void;
  cardsPerPage: number;
  totalCards: number;
  handlePageChange: (_: React.ChangeEvent<unknown>, value: number) => void;
  currentPage: number;
}

const WordBankGridFooter = ({
  handleCardsPerPageChange,
  cardsPerPage,
  totalCards,
  handlePageChange,
  currentPage,
}: WordBankGridFooterProps) => {
  const defaultOption: OptionData = { name: "12", value: 12, id: 1 };
  const [showCardOptions, setShowCardOptions] = useState<OptionData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const options: OptionData[] = [];
    const iterations = Math.ceil(totalCards / 12);
    for (let i = 1; i <= iterations; i++) {
      options.push({
        value: i * 12,
        name: `${i * 12}`,
        id: i,
      });
    }
    setShowCardOptions(options);
  }, [totalCards]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalCards / cardsPerPage));
  }, [totalCards, cardsPerPage]);

  return (
    <div className='w-full bg-white dark:bg-backgroundPaper-d py-2 border-t dark:border-black grid grid-cols-2'>
      <div className='flex'>
        <span className='mt-2.5 ml-3 text-sm'>Show</span>
        <AppSelect
          className='ml-2'
          dropdownColor={DropdownColor.SECONDARY}
          dropdownVariant={DropdownVariant.GHOST}
          value={
            showCardOptions.find((option) => option.value === cardsPerPage) ??
            defaultOption
          }
          data={showCardOptions}
          isReverseDropdown={true}
          onChange={handleCardsPerPageChange}
        />
        <span className='mt-2.5 ml-3 text-sm'>Cards</span>
      </div>
      <div className='justify-self-end mr-4 flex'>
        <span className='mt-2.5 mr-3 text-sm'>
          {currentPage * cardsPerPage - cardsPerPage + 1}-
          {currentPage * cardsPerPage > totalCards
            ? totalCards
            : currentPage * cardsPerPage}{" "}
          of {totalCards}
        </span>
        <Pagination
          className='mt-1'
          count={totalPages}
          shape='rounded'
          color='primary'
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default WordBankGridFooter;
