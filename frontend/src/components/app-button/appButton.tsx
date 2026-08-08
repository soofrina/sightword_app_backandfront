import React from "react";

import { Button } from "@mui/material";
import { customButtonStyle } from "@utility/appButton";
import { ButtonVariant, ButtonColor } from "@base/type/appButton";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const AppButton = ({
  children,
  className,
  variant = ButtonVariant.SOLID,
  color = ButtonColor.PRIMARY,
  startIcon,
  endIcon,
  onClick,
  disabled,
}: ButtonProps) => {
  const btnStyle = customButtonStyle(variant, color);

  return (
    <Button
      className={`normal-case ${btnStyle} ${className}`}
      variant={variant}
      color={color}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      component='label' // supports file upload
      disableElevation
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default AppButton;
