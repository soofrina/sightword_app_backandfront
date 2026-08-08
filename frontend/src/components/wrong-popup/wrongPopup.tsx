import { Close } from "@material-ui/icons";
import React from "react";

type WrongPopupProps = {
    className?: string;
	  onClose: () => void;
    wrongMsg?: string;
	}
	
	const WrongPopup = ({ onClose, className, wrongMsg }: WrongPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 max-w-md ${className}`} style={{bottom: "3%"}}>
      <Close onClick={handleOnClose} className="absolute top-1 left-1 pointer"/>
      <div className="bg-rose-300 text-red-500 font-bold text-lg p-5 rounded shadow-lg rounded-2xl">
        
        {!wrongMsg && "Uh-oh, That is not quite right."}
        {wrongMsg && wrongMsg}
      </div>
    </div>
  );
};

export default WrongPopup;
