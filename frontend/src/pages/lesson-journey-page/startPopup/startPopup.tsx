import React from "react";

type StartPopupProps = {
  onClose: () => void;
}

const StartPopup = ({ onClose }: StartPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md relative">
        <div className= "text-black rounded-lg relative">
          Tap any of these or the arrows to go back and forth.
        </div>
        <div className="flex justify-end">
          <button className="text-primaryMain font-medium" onClick={handleOnClose}>Got it!</button>
        </div>
      </div>
    </div>
  );
};

export default StartPopup;
