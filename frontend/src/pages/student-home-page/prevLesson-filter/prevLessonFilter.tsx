import { useState } from "react";

type PrevLessonFilterProps = {
  content: string;
  isPressed: boolean;
  onClick: () => void;
};

const PreviousLessonSelector = ({
  content,
  isPressed,
  onClick,
}: PrevLessonFilterProps) => {
  // return (
  //     <button
  //     className={`rounded-lg flex py-1 justify-center items-center px-4 border
  //     border-gray-700 whitespace-nowrap mr-3 ${isPressed ? "bg-slate-200" : ""}`}
  //     onClick={handleClick}
  //     >
  //     {content}
  //     </button>
  //  );
  return (
    <button
      className={`rounded-lg flex py-1 justify-center items-center px-4 shadow-sm	 whitespace-nowrap mr-3 ${
        isPressed ? "bg-slate-200" : "bg-white"
      } cursor-pointer`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default PreviousLessonSelector;
