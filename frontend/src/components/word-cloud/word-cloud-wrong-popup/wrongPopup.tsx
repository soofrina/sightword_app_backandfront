import React from "react";

type WrongPopupProps = {
  onClose: () => void;
};

const WrongPopup = ({ onClose }: WrongPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div
      className='fixed left-1/2 transform -translate-x-1/2 max-w-md'
      style={{ bottom: "20%" }}
    >
      <div className='bg-red-600 text-white font-bold text-lg p-5 rounded shadow-lg rounded-2xl'>
        Uh-oh, That is not quite right.
      </div>
    </div>
  );
};

export default WrongPopup;
