import Typography from "@mui/material/Typography/Typography";

interface FormSubtextProps {
  children: React.ReactNode;
}

const FormSubtext = ({ children }: FormSubtextProps) => {
  return (
    <Typography variant='subtitle1' sx={{ fontSize: "10px", color: "#ABABAB" }}>
      {children}
    </Typography>
  );
};

export default FormSubtext;
