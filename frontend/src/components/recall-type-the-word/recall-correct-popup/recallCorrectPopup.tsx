import React from "react";

type CorrectPopupProps = {
  onClose: () => void;
  count?: number;
}

const RecallCorrectPopup = ({ onClose, count}: CorrectPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };
  
  const countRemaining = count ? 3 - count : 3;

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bottom-20 max-w-md" style={{bottom: "3%"}}>
      {count === 3 ? (
        <div className="bg-lime-300 text-green-500 font-bold text-lg p-5 rounded shadow-lg rounded-2xl">
          Great Job! Tap on the next button on the right to continue
        </div>
      ) : (
        <div className="bg-lime-300 text-green-500 font-bold text-lg p-5 rounded shadow-lg rounded-2xl">
          Good Job! Let&apos;s type the word {countRemaining} more time(s)!
        </div>
      )}
    </div>
  );
};
export default RecallCorrectPopup;
