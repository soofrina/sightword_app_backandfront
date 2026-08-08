import ModeEditIcon from "@mui/icons-material/ModeEdit";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";

import { formatDate } from "@base/utility/common";
import { WordBankRow } from "@base/pages/word-bank-page";

interface WordBankTableLastEditCellProps {
  id: string;
  lastEdit: Date;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const WordBankTableLastEditCell = ({
  id,
  lastEdit,
  onEdit,
  onDelete,
}: WordBankTableLastEditCellProps) => {
  return (
    <div className='grid grid-cols-7 w-full'>
      <div className='col-span-5'>{formatDate(lastEdit)}</div>
      <div>
        <ModeEditIcon
          onClick={onEdit}
          className='text-[#ABABAB] cursor-pointer'
        />
      </div>
      <div>
        <RestoreFromTrashIcon
          onClick={() => onDelete(id)}
          className='text-[#ABABAB] cursor-pointer'
        />
      </div>
    </div>
  );
};

export default WordBankTableLastEditCell;
