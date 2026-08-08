import { Box, Modal, Typography } from "@mui/material";
import AppButton from "@components/app-button";
import { ButtonVariant } from "@base/type/appButton";
import {
  ImageApprovalStatus,
  LessonWordData,
  WordAttemptProgress,
} from "@base/type/dataTypes";
import { updateWordAttempt } from "@base/api/lessons";

interface ApprovePersonalizationProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  lessonWordData?: LessonWordData;
}

const ApprovePersonalization = ({
  open,
  onClose,
  studentName,
  lessonWordData,
}: ApprovePersonalizationProps) => {
  const getLatestAttempt = () => {
    if (!lessonWordData?.attempts) return null;
    if (lessonWordData.attempts.length === 0) return null;
    return lessonWordData.attempts[lessonWordData.attempts.length - 1];
  };

  const getPersonalizedImageLink = (): string => {
    const latestAttempt = getLatestAttempt();
    if (!latestAttempt) return "";
    return latestAttempt.personalisedImageLink;
  };

  const imageUrl = getPersonalizedImageLink();
  const word = lessonWordData?.word.word ?? "";
  const sentence = lessonWordData?.word.sentence ?? "";

  const setApprovalStatus = (status: ImageApprovalStatus) => {
    const latestAttempt = getLatestAttempt();
    if (!latestAttempt) return;

    updateWordAttempt(
      latestAttempt.id,
      latestAttempt.progress as WordAttemptProgress,
      status,
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className='bg-gray-100 flex items-center justify-center'
    >
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <Typography
          id='modal-modal-title'
          variant='h5'
          className='font-bold'
          sx={{ fontSize: "40px" }}
        >
          {studentName} Image/Drawing
        </Typography>
        <Box className='flex justify-center'>
          <img src={imageUrl} alt='student drawing' className='w-96 h-96' />
          <Box className='flex flex-col p-8 justify-between'>
            <Box>
              <div className='inline'>
                <Typography className='font-bold'>Word: </Typography>
                <Typography>{word}</Typography>
              </div>
              <div className='inline'>
                <Typography className='font-bold'>Sentence: </Typography>
                <Typography>{sentence}</Typography>
              </div>
            </Box>
            <Box className='flex justify-end'>
              <AppButton
                className='m-2'
                variant={ButtonVariant.OUTLINED}
                onClick={() => setApprovalStatus(ImageApprovalStatus.REJECTED)}
              >
                Reject
              </AppButton>
              <AppButton
                className='m-2'
                variant={ButtonVariant.SOLID}
                onClick={() => setApprovalStatus(ImageApprovalStatus.APPROVED)}
              >
                Approve
              </AppButton>
            </Box>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

export default ApprovePersonalization;
