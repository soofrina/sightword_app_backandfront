import React from "react";

const ShowWord = () => {
  const word = "Show";

  return (
<div className="w-screen h-screen flex flex-col justify-start">
  <div className="text-center text-xl text-textPrimary m-4">TODAY&apos;S FIRST WORD</div>
  <div className="mt-10 font-medium text-9xl text-center">{word}</div>
</div>

  );  
};
export default ShowWord;
