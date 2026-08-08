import { InputLabel } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}

const FormLabel = ({ children, htmlFor, required = false }: FormLabelProps) => {
  return (
    <div className='flex flex-row'>
      <InputLabel
        htmlFor={htmlFor}
        className='font-bold text-textPrimary dark:text-textPrimary-d'
      >
        {children}
      </InputLabel>
      {required && (
        <Typography
          variant='subtitle1'
          sx={{ color: "#F4A295", transform: "translate(0px, -5px)" }}
        >
          *
        </Typography>
      )}
    </div>
  );
};

export default FormLabel;
