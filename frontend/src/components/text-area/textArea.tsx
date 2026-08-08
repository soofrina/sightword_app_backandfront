import React, { ChangeEvent } from "react";

interface TextAreaProps {
  className?: string;
  placeholder?: string;
  // Double Binding to retrieve Text
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
}

const TextArea = ({
  placeholder,
  className,
  value,
  onChange,
  isDisabled = false,
}: TextAreaProps) => {
  return (
    <textarea
      disabled={isDisabled}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`outline-none border resize-none rounded-md px-5 py-3 ${className}`}
    />
  );
};

export default TextArea;
