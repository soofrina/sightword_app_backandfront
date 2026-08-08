import { Close } from "@material-ui/icons";
import React from "react";

type CorrectPopupProps = {
  onClose: () => void;
  className?: string;
  correctMsg?: string;
}

const CorrectPopup = ({ onClose, className, correctMsg }: CorrectPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 max-w-md ${className}`} style={{bottom: "3%"}}>
      <Close onClick={handleOnClose} className="absolute top-1 left-1 pointer"/>
      <div className="bg-lime-300 text-green-500 font-bold text-lg p-5 rounded shadow-lg rounded-2xl">
        {!correctMsg && "Great Job! Tap on the next button on the right to continue."}
        {correctMsg && correctMsg}
      </div>
    </div>
  );
};

export default CorrectPopup;
