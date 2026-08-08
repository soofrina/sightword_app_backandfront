import AppButton from "@components/app-button";
import PopUpModal from "@components/popup-model";
import { ButtonVariant } from "@base/type/appButton";
import { SvgIcon, Typography } from "@mui/material";
import { ReactComponent as WarningIcon } from "assets/WarningIcon.svg";
import { WordBankRow } from "pages/word-bank-page/wordBankPage";
import WordCard from "@components/word-bank/word-bank-word-card";

interface WordBankDeleteWordPopUpProps {
  isOpen: boolean;
  deletionData: WordBankRow[];
  onClose: () => void;
  onWordDeletionCancel: (id: string) => void;
  onAllWordDelete: () => void;
}

const WordBankDeleteWordPopUp = ({
  isOpen,
  deletionData,
  onClose,
  onWordDeletionCancel,
  onAllWordDelete,
}: WordBankDeleteWordPopUpProps) => {
  return (
    <PopUpModal popUpTitle='Delete Words' open={isOpen} onClose={onClose}>
      <div className='mt-5 w-full h-full flex flex-col gap-2 justify-start'>
        <Typography variant='caption' className='font-bold text-[16px]'>
          Selected:
        </Typography>
        <div className='grid grid-cols-4 gap-4'>
          {deletionData.map((word) => {
            return (
              <div key={word.id}>
                <WordCard
                  wordId={word.id}
                  word={word.wordFilter}
                  sentence={word.sentence}
                  onCancel={onWordDeletionCancel}
                />
              </div>
            );
          })}
        </div>
        <div
          className='w-full h-fit rounded p-4 grid grid-rows-3 gap-x-3 gap-y-2'
          style={{
            backgroundColor: "#F7E1D2",
            gridTemplateColumns: "min-content 1fr",
          }}
        >
          <SvgIcon
            component={WarningIcon}
            viewBox='0 0 29 26'
            className='col-start-1 col-span-1 row-start-1 row-span-1'
          />
          <Typography
            className='col-start-2 col-span-1 row-start-1 row-span-1 font-bold'
            sx={{ color: "#FF6D56" }}
          >
            Warning
          </Typography>
          <Typography
            variant='caption'
            className='col-start-2 col-span-1 row-start-2 row-span-2'
            sx={{ color: "#FF6D56" }}
          >
            <p>Are you sure you want to delete the word(s) above?</p>
            <p>The word(s) will be permanently disabled.</p>
          </Typography>
        </div>
        <div className='mt-10 flex flex-row gap-4 justify-end'>
          <AppButton
            className='rounded border-opacity-100 text-[#ABABAB] border-[#ABABAB]'
            variant={ButtonVariant.OUTLINED}
            onClick={onClose}
          >
            Cancel
          </AppButton>
          <AppButton
            className='rounded bg-[#F4A295] border-opacity-100 text-[#FFFFFF]'
            variant={ButtonVariant.SOLID}
            onClick={() => {
              onAllWordDelete();
              onClose();
            }}
          >
            Delete
          </AppButton>
        </div>
      </div>
    </PopUpModal>
  );
};

export default WordBankDeleteWordPopUp;
