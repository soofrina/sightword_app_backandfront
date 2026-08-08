import React, { KeyboardEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  // Double Binding to retrieve Text
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

const SearchBar = ({
  placeholder,
  className,
  value,
  onChange,
  onSearch,
}: SearchBarProps) => {
  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch && onSearch();
    }
  };

  return (
    <OutlinedInput
      value={value}
      onChange={onChange}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
      className={`outline-none placeholder=${placeholder} placeholder:italic hover:shadow-xl hover:outline-none focus:outline-none focus:border-none focus:text-black	${className}`}
      startAdornment={
        <InputAdornment position='start'>
          <SearchIcon />
        </InputAdornment>
      }
    />
  );
};

export default SearchBar;
