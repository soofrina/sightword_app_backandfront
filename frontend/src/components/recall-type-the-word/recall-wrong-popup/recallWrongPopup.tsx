import React from "react";

type WrongPopupProps = {
	  onClose: () => void;
	}
	
	const RecallWrongPopup = ({ onClose }: WrongPopupProps) => {
  const handleOnClose = () => {
    onClose();
  };

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bottom-20 max-w-md" style={{bottom: "3%"}}>
      <div className="bg-rose-300 text-red-500 font-bold text-lg p-5 rounded shadow-lg rounded-2xl">
        Uh-oh, That is not quite right.
        Try again or toggle back to review the word!
      </div>
    </div>
  );
};

export default RecallWrongPopup;
