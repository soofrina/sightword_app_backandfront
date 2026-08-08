import React from "react";
import { Box } from "@mui/material";

interface ProgressCircleProps {
  backgroundColor: string;
  stageLetter: string;
  onClick?: () => void;
}

const ProgressCircle = ({
  onClick,
  backgroundColor,
  stageLetter,
}: ProgressCircleProps) => {
  return (
    <Box
      onClick={onClick}
      className={`rounded-full mx-1 w-9 h-9 flex justify-center items-center ${
        onClick ? "cursor-pointer" : ""
      }`}
      sx={{
        backgroundColor: backgroundColor,
        border: "3px solid",
        borderColor: "secondary.contrastText",
      }}
    >
      {stageLetter}
    </Box>
  );
};

export default ProgressCircle;
