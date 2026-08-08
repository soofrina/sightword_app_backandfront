import GridCard from "./word-bank-grid-card";
import WordBankGridFooter from "./wordBankGridFooter";
import { WordBankGrid, WordBankGridCard } from "@pages/word-bank-page";
import { OptionData } from "@base/type/appSelect";

import styles from "./wordBankGridView.module.css";

interface WordBankGridViewProps {
  data: WordBankGrid[];
  handleCardsPerPageChange: (data: OptionData) => void;
  cardsPerPage: number;
  totalCards: number;
  handlePageChange: (_: React.ChangeEvent<unknown>, value: number) => void;
  currentPage: number;
  onShowDeletePopup?: (id: string) => void;
  onCardClick: (gridCards: WordBankGridCard[]) => void;
  onEditClick?: (gridCards: WordBankGridCard[]) => void;
}

const WordBankGridView = ({
  data,
  handleCardsPerPageChange,
  cardsPerPage,
  totalCards,
  handlePageChange,
  currentPage,
  onShowDeletePopup,
  onCardClick,
  onEditClick,
}: WordBankGridViewProps) => {
  return (
    <div>
      {data && data.length > 0 ? (
        <div
          className={`bg-[#F7F7F7] dark:bg-[#424242] grid grid-cols-4 w-full border-t max-h-[580px] overflow-y-scroll ${styles.scrollHideChrome} ${styles.scrollHideIE}`}
        >
          {data.map((word) => (
            <div key={word.id}>
              <GridCard
                onClick={() => onCardClick(word.card)}
                onDelete={onShowDeletePopup}
                onEdit={onEditClick ? () => onEditClick(word.card) : undefined}
                data={word.card}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='flex justify-center w-full py-64'>No Cards</div>
      )}

      <WordBankGridFooter
        cardsPerPage={cardsPerPage}
        handleCardsPerPageChange={handleCardsPerPageChange}
        totalCards={totalCards}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export default WordBankGridView;
