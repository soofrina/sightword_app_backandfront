import { styled } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField/TextField";

const FormMultilineTextField = styled(TextField)({
  "& .MuiOutlinedInput-notchedOutline": {
    display: "none",
  },
});

const WrappedFormMultilineTextField = (props: TextFieldProps) => (
  <FormMultilineTextField
    className={`bg-primaryLight dark:bg-primaryLight-d [&>input]:p-4 
       [&>input]:p-1 [&>input]:pl-3 rounded-md ${props.className}`}
    {...props}
  >
    {props.children}
  </FormMultilineTextField>
);

export default WrappedFormMultilineTextField;
