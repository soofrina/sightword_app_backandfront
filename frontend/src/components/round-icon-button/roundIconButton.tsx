import React from "react";
import { IconButton } from "@material-ui/core";

interface RoundIconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
}

const RoundIconButton = ({
  icon,
  onClick,
  className,
  hidden = false,
  disabled = false,
}: RoundIconButtonProps) => {
  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      className={`w-12 h-12 ${
        disabled ? "bg-textDisabled" : "bg-primaryMain"
      } rounded-full text-white flex items-center justify-center ${className} ${
        hidden && "hidden"
      }`}
    >
      {icon}
    </IconButton>
  );
};

export default RoundIconButton;
