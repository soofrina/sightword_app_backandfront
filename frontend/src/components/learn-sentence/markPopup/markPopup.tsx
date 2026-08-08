import React, { useEffect, useState } from "react";
import CorrectPopup from "@base/components/correct-popup/correctPopup";
import WrongPopup from "@base/components/wrong-popup/wrongPopup";
import { Check, Close } from "@material-ui/icons";
import { toast } from "react-toastify";
import { toastCorrect, toastWrong } from "@base/utility/toast";

type MarkPopupProps = {
  hidden?: boolean;
  className?: string;
  onClose?: () => void;

  // additional functions to run when mark correct or wrong
  onCorrect?: () => void;
  onWrong?: () => void;

  // optional customize correct and wrong popup msg
  correctMsg?: string;
  wrongMsg?: string;
};

const MarkPopup = ({
  onClose,
  className,
  onCorrect,
  onWrong,
  hidden = true,
  correctMsg,
  wrongMsg = "Uh-oh... That’s not quite right. Try again!",
}: MarkPopupProps) => {
  const handleOnClose = () => {
    onClose && onClose();
  };

  const markCorrect = () => {
    onCorrect && onCorrect();
    toastCorrect(correctMsg);
    onClose && onClose();
  };

  const markWrong = () => {
    onWrong && onWrong();
    toastWrong(wrongMsg);
    onClose && onClose();
  };

  return (
    <>
      <div
        className={`absolute bottom-2 right-2 rounded-md bg-slate-200 px-4 py-6 w-40 ${className} ${
          hidden && "hidden"
        }`}
      >
        <Close
          onClick={handleOnClose}
          className='absolute top-1 left-1 pointer'
        />
        <div className='font-semibold'>Mark the student</div>
        <button
          className='outline-none outline-green-500 m-2 p-1 rounded-sm flex w-5/6'
          onClick={markCorrect}
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
            <Check style={{ color: "green" }} />
          </svg>
          <span className='text-green-600'>Correct</span>
        </button>

        <button
          className='outline-none outline-red-500 m-2 p-1 rounded-sm flex w-5/6'
          onClick={markWrong}
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
            <Close style={{ color: "red" }} />
          </svg>
          <span className='text-red-600'>Wrong</span>
        </button>
      </div>
      {/* <div>
        {showPopup === "correct" && (
          <CorrectPopup
            onClose={handleCorrectPopupClose}
            className='bottom-24'
            correctMsg={correctMsg}
          />
        )}
        {showPopup === "wrong" && (
          <WrongPopup
            onClose={handleWrongPopupClose}
            className='bottom-24'
            wrongMsg={wrongMsg}
          />
        )}
      </div> */}
    </>
  );
};

export default MarkPopup;
