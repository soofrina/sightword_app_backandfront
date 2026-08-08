import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";

type HelpPopupProps = {
  className?: string;
  message: JSX.Element;
  actionText: string;
  onClose: (hidePermanent: boolean) => void;
};

const HelpPopup = ({
  onClose,
  message,
  actionText,
  className,
}: HelpPopupProps) => {
  const [hidePermanent, setHidePermanent] = useState<boolean>(false);
  const handleOnClose = () => {
    onClose(hidePermanent);
  };

  const onChange = () => {
    setHidePermanent(!hidePermanent);
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className='bg-white p-6 rounded-lg shadow-md relative'>
        <div className='text-black rounded-lg relative'>{message}</div>
        <div>
          <FormControlLabel
            className='text-black'
            control={<Checkbox />}
            label="Don't show this again"
            checked={hidePermanent}
            onChange={onChange}
          />
        </div>
        <div className='flex justify-end'>
          <button
            className='text-primaryMain font-medium'
            onClick={handleOnClose}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
