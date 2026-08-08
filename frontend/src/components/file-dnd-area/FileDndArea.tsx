import React, { useState, useRef } from "react";

import Typography from "@mui/material/Typography";

interface FileDnDAreaProps {
  setFileChosen: (file: File) => void;
  text: string;
  accept: string; // accepted file extensions or types
}

const FileDndArea = ({ setFileChosen, text, accept }: FileDnDAreaProps) => {
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileChosen(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFileChosen(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        className='hidden'
        onChange={handleChange}
      />
      <label
        htmlFor='input-file-upload'
        className='flex items-center justify-center text-center'
      >
        <div className='flex flex-col items-center'>
          <Typography
            variant='caption'
            className='text-center'
            sx={{ color: "#ABABAB", width: "100%" }}
          >
            {text}
          </Typography>
          <Typography
            variant='caption'
            className='text-center'
            sx={{ color: "#ABABAB", width: "100%" }}
          >
            or
          </Typography>
          <button
            style={{
              backgroundColor: "#E17968",
              color: "#FFFFFF",
            }}
            className='px-3 py-1 my-2 rounded w-fit'
            onClick={onButtonClick}
          >
            Browse File
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          className='absolute w-full h-full'
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
};

export default FileDndArea;
