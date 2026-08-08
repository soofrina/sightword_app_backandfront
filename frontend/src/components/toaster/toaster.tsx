import React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Alert, Stack } from "@mui/material";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import WarningIcon from "@mui/icons-material/WarningAmber";

interface ToasterProps extends SnackbarOrigin {
  isOpen: boolean;
  className?: string;
  messageHeader?: string;
  messageBody?: string;
  isSuccess?: boolean;
  icon?: boolean;
  vertical: "top" | "bottom";
  horizontal: "center" | "left" | "right";
  autoHide?: boolean;
  onClose?: () => void;
}

const Toaster = (props: ToasterProps) => {
  const {
    className,
    messageHeader,
    messageBody,
    isSuccess,
    icon,
    vertical = "bottom",
    horizontal = "right",
    autoHide = true,
    isOpen,
    onClose,
  } = props;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return className;
    }
    onClose && onClose();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHide ? 5000 : null}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        icon={
          icon ? (
            isSuccess ? (
              <DownloadDoneIcon fontSize='inherit' />
            ) : (
              <WarningIcon fontSize='inherit' />
            )
          ) : (
            false
          )
        }
        onClose={handleClose}
        severity={isSuccess ? "success" : "error"}
      >
        <Stack className=''>
          <h1 className='font-bold'>{messageHeader}</h1>
          <p> {messageBody} </p>
        </Stack>
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
