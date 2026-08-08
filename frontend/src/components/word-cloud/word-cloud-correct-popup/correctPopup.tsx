import React from "react";

type CorrectPopupProps = {
  onClose: () => void;
};

const CorrectPopup = ({ onClose }: CorrectPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div
      className='fixed left-1/2 transform -translate-x-1/2 max-w-md'
      style={{ bottom: "20%" }}
    >
      <div className='bg-green-600 text-white font-bold text-lg p-5 rounded shadow-lg rounded-2xl'>
        Great Job! Tap on the next button on the right to continue.
      </div>
    </div>
  );
};

export default CorrectPopup;
