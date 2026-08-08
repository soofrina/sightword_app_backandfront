import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CrossIcon } from "assets/Cancel.svg";

interface PopUpModalProps {
  popUpTitle: string;
  children: React.ReactNode;
  open: boolean;
  minWidth?: string;
  minHeight?: string;
  onClose: () => void;
  altButton?: React.ReactNode;
  altHeader?: React.ReactNode;
}

const PopUpModal = ({
  popUpTitle,
  children,
  open,
  onClose,
  minWidth = "40%",
  minHeight = "50%",
  altButton = <></>,
  altHeader = <></>,
}: PopUpModalProps) => {
  return (
    <Modal
      style={{ zIndex: 12 }}
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      componentsProps={{
        backdrop: () => ({
          sx: {
            zIndex: "-1",
            backgroundColor: "transparent",
          },
        }),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "max-content",
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: "80%",
          maxHeight: "60%",
          overflow: "auto",
          outline: "none",
          backfaceVisibility: "hidden",
        }}
        className='shadow-lg rounded-xl p-8 bg-secondaryMain dark:bg-primaryDark-d'
      >
        <div className='absolute right-7 top-5 flex flex-row justify-end items-center gap-2'>
          {altButton}
          <SvgIcon
            component={CrossIcon}
            viewBox='0 0 14 14'
            sx={{ width: "10px", cursor: "pointer" }}
            onClick={onClose}
          />
        </div>
        <div className='flex flex-col w-full h-full'>
          <div className='w-fit flex flex-row gap-5'>
            <Typography
              id='modal-modal-title'
              variant='h5'
              className='font-bold'
              sx={{ fontSize: "40px" }}
            >
              {popUpTitle}
            </Typography>
            {altHeader}
          </div>
          <div className='flex-grow flex flex-col justify-center items-center'>
            {children}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default PopUpModal;
