import { Modal, ModalProps } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ExitPopupProps {
  open: boolean;
  onClose: () => void;
}

const ExitPopup = ({ onClose, open }: ExitPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };
  const navigate = useNavigate();
  const onExitLesson = () => {
    navigate(-1);
  };

  return (
    <Modal open={open} className='bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-center font-bold text-xl mb-4'>Exit Lesson?</h2>
        <div className='text-center mb-4'>
          Are you sure you want to exit the lesson now?
        </div>
        <div className='flex justify-center space-x-4'>
          <button
            className='rounded-md text-primaryMain border border-primaryMain px-4 py-2'
            onClick={handleOnClose}
          >
            Cancel
          </button>
          <button
            className='rounded-md text-white bg-primaryMain px-4 py-2'
            onClick={onExitLesson}
          >
            Exit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExitPopup;
