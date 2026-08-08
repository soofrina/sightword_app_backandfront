import React from "react";

interface OverFlowTextProps {
  children: React.ReactNode;
  className?: string;
}

const OverFlowText = ({ className, children }: OverFlowTextProps) => {
  return <p className={`${className} truncate`}>{children}</p>;
};

export default OverFlowText;
