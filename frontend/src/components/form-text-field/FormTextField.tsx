import { useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    padding: "4px",
    paddingLeft: "10px",
    borderRadius: "0.5em",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    // error helper text
    color: "#FF6D56",
  },
  "& .MuiFormHelperText-root": {
    margin: "0px 0px 3px 0px", // align helper text with text field
  },
  "&": {
    flexDirection: "column-reverse", // reverse order for helper text to be above
  },
});

interface FormTextFieldProps {
  id?: string;
  inputRef?: React.RefObject<React.FC> | null;
  errorMsg?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const FormTextField = ({
  id,
  inputRef = null,
  errorMsg = "",
  placeholder = "",
  value,
  onChange,
  disabled = false,
}: FormTextFieldProps) => {
  const [isError, setIsError] = useState<boolean>(false);

  const onFormTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange?.(event);
    setIsError(event.target.value.length <= 0);
  };

  return (
    <StyledTextField
      className='[&>div]:bg-primaryLight [&>div]:dark:bg-primaryLight-d'
      id={id}
      inputRef={inputRef}
      error={isError}
      helperText={isError ? errorMsg : ""}
      placeholder={placeholder}
      onChange={onFormTextFieldChange}
      value={value}
      disabled={disabled}
    />
  );
};

export default FormTextField;
