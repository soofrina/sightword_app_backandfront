import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CancelIcon } from "assets/Cancel.svg";
import { ReactComponent as ValidationPassIcon } from "assets/ValidationPass.svg";
import { ReactComponent as ValidationErrorIcon } from "assets/ValidationError.svg";
import { ImportTarget } from "./BulkImportPopUp";

interface ValidationProgressRowProps {
  row: number;
  text: string;
  progressState: number;
  showError: boolean;
  errorMsg: string;
}

const ValidationProgressRow = ({
  text,
  progressState,
  row,
  showError,
  errorMsg,
}: ValidationProgressRowProps) => {
  return (
    <>
      <Typography
        variant='caption'
        className={`col-start-1 col-end-1 row-start-${row} row-end-${row} text-right overflow-hidden overflow-ellipsis`}
        sx={{ width: "100%" }} // fixed width with cross button to center progress bar with icon
      >
        {text}
      </Typography>

      {!showError && progressState < 100 && (
        <LinearProgress
          variant='determinate'
          value={progressState}
          className={`col-start-2 col-span-2 row-start-${row} row-end-${row} self-center rounded`}
          // color="primary"
          sx={{
            width: "100%",
            height: "8px",
            backgroundColor: "#D9D9D9",
            "& .MuiLinearProgress-bar": {
              borderRadius: "1em",
              backgroundColor: "#F4A295",
            },
          }}
        />
      )}

      {!showError && progressState === 100 && (
        <>
          <Typography
            variant='caption'
            className={`col-start-2 col-end-2 row-start-${row} row-end-${row} text-center overflow-hidden overflow-ellipsis`}
            sx={{ width: "100%" }} // fixed width with cross button to center progress bar with icon
          >
            Validated
          </Typography>
          <SvgIcon
            component={ValidationPassIcon}
            viewBox='0 0 25 25'
            sx={{ gridColumnStart: "3", width: "25px" }}
          />
        </>
      )}

      {showError && (
        <>
          <Typography
            variant='caption'
            className={`col-start-2 col-end-2 row-start-${row} row-end-${row} text-center overflow-hidden overflow-ellipsis`}
            sx={{ color: "#FF6D56", width: "100%" }} // fixed width with cross button to center progress bar with icon
          >
            {errorMsg}
          </Typography>
          <SvgIcon
            component={ValidationErrorIcon}
            viewBox='0 0 25 25'
            sx={{ gridColumnStart: "3", width: "25px" }}
          />
        </>
      )}
    </>
  );
};

interface ValidationProgressProps {
  fileChosen: File;
  setValidationSuccess: (bool: boolean) => void;
  setIsValidating: (bool: boolean) => void;
  resetFileChosen: () => void;
  importTarget: ImportTarget;
}

const ValidationProgress = ({
  fileChosen,
  setValidationSuccess,
  setIsValidating,
  resetFileChosen,
  importTarget,
}: ValidationProgressProps) => {
  const [row1Progress, setRow1Progress] = useState<number>(0);
  const [row2Progress, setRow2Progress] = useState<number>(0);
  const [row3Progress, setRow3Progress] = useState<number>(0);
  const [row4Progress, setRow4Progress] = useState<number>(0);

  const [row1Error, setRow1Error] = useState<boolean>(false);
  const [row2Error, setRow2Error] = useState<boolean>(false);
  const [row3Error, setRow3Error] = useState<boolean>(false);
  const [row4Error, setRow4Error] = useState<boolean>(false);

  const [showResetButton, setShowResetbutton] = useState<boolean>(false);

  const validatePresence = (
    csvData: string[] | undefined,
    targetCol: string,
    setProgress: (p: number) => void,
    setError: (b: boolean) => void,
  ) => {
    let targetIndex = -1;

    csvData?.forEach((line, index) => {
      if (index === 0) {
        line.split(",").forEach((col, colIndex) => {
          if (col.trim() === targetCol.trim()) {
            targetIndex = colIndex;
          }
        });
      } else {
        const progress = ((index + 1) / csvData.length) * 100;
        if (targetIndex === -1) {
          // column index not found from above
          setError(true);
          return;
        } else if (line === undefined || line === "") {
          // end of file
          setProgress(progress);
        } else if (line.split(",")[targetIndex].trim() === "") {
          // entry missing
          setError(true);
          return;
        } else {
          setProgress(progress);
        }
      }
    });
  };

  const validateCSV = () => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const result = data?.toString().split("\n");

      if (importTarget === ImportTarget.STUDENT) {
        validatePresence(result, "name", setRow1Progress, setRow1Error);
        validatePresence(result, "student_id", setRow2Progress, setRow2Error);
        validatePresence(result, "email", setRow3Progress, setRow3Error);
      } else if (importTarget === ImportTarget.TEACHER) {
        validatePresence(result, "name", setRow1Progress, setRow1Error);
        validatePresence(result, "staff_id", setRow2Progress, setRow2Error);
        validatePresence(result, "email", setRow3Progress, setRow3Error);
        validatePresence(result, "role", setRow4Progress, setRow4Error);
      }
    };

    reader.readAsText(fileChosen);
  };

  useEffect(() => {
    if (fileChosen === undefined) return;

    validateCSV();
  }, [fileChosen]);

  useEffect(() => {
    if (row1Error || row2Error || row3Error || row4Error) {
      setTimeout(() => {
        setShowResetbutton(true);
        setValidationSuccess(false);
      }, 1000);
    }

    if (
      row1Progress === 100 &&
      row2Progress === 100 &&
      row3Progress === 100 &&
      (importTarget !== ImportTarget.TEACHER || row4Progress === 100)
    ) {
      setTimeout(() => {
        setRow1Progress(0);
        setRow2Progress(0);
        setRow3Progress(0);
        setRow4Progress(0);
        setIsValidating(false);

        setValidationSuccess(true);
      }, 1000);
    }
  }, [
    row1Progress,
    row2Progress,
    row3Progress,
    row1Error,
    row2Error,
    row3Error,
  ]);

  const resetStates = () => {
    setShowResetbutton(false);

    setRow1Progress(0);
    setRow2Progress(0);
    setRow3Progress(0);
    setRow4Progress(0);

    setIsValidating(false);
    setValidationSuccess(false);

    resetFileChosen();
  };

  const onNewUploadButtonClick = () => {
    resetStates();
  };

  const onCancelUploadClick = () => {
    resetStates();
  };

  interface NewUploadButtonProps {
    hidden?: boolean;
  }

  // Hidden button for centralising text in the center
  const NewUploadButton = ({ hidden = false }: NewUploadButtonProps) => {
    return (
      <button
        style={{
          backgroundColor: hidden ? "transparent" : "#E17968",
          color: hidden ? "transparent" : "#FFFFFF",
        }}
        className={`${
          hidden ? "pointer-events-none select-none" : ""
        } px-3 py-1 my-2 rounded w-fit`}
        onClick={onNewUploadButtonClick}
      >
        Upload Another File
      </button>
    );
  };

  return (
    <div className='flex flex-col items-center gap-2 w-full h-full'>
      <div className='flex flex-row gap-2 items-center'>
        <Typography
          variant='caption'
          className='text-center overflow-hidden overflow-ellipsis'
          sx={{ color: "#ABABAB", width: "100%" }} // fixefileChosend width with cross button to center progress bar with icon
        >
          Validating: {fileChosen?.name}
        </Typography>

        <SvgIcon
          component={CancelIcon}
          viewBox='0 0 14 14'
          sx={{ width: "14px" }}
          onClick={onCancelUploadClick}
        />
      </div>

      <div className='grid grid-rows-3 grid-cols-3 gap-x-2 gap-y-1'>
        {importTarget === ImportTarget.STUDENT && (
          <>
            <ValidationProgressRow
              row={1}
              text='Name'
              progressState={row1Progress}
              showError={row1Error}
              errorMsg={"ERROR"}
            />
            <ValidationProgressRow
              row={2}
              text='Student ID'
              progressState={row2Progress}
              showError={row2Error}
              errorMsg={"ERROR"}
            />
            <ValidationProgressRow
              row={3}
              text='Email'
              progressState={row3Progress}
              showError={row3Error}
              errorMsg={"ERROR"}
            />
          </>
        )}

        {importTarget === ImportTarget.TEACHER && (
          <>
            <ValidationProgressRow
              row={1}
              text='Name'
              progressState={row1Progress}
              showError={row1Error}
              errorMsg={"ERROR"}
            />
            <ValidationProgressRow
              row={2}
              text='Teacher ID'
              progressState={row2Progress}
              showError={row2Error}
              errorMsg={"ERROR"}
            />
            <ValidationProgressRow
              row={3}
              text='Email'
              progressState={row3Progress}
              showError={row3Error}
              errorMsg={"ERROR"}
            />
            <ValidationProgressRow
              row={4}
              text='Role'
              progressState={row4Progress}
              showError={row4Error}
              errorMsg={"ERROR"}
            />
          </>
        )}
      </div>

      <div
        className={`${
          showResetButton ? "" : "hidden"
        } flex items-center justify-between w-full`}
      >
        <NewUploadButton hidden />

        <Typography
          variant='caption'
          className='text-center'
          sx={{ color: "#FF6D56" }}
        >
          Upload Error. Please fix or upload another file.
        </Typography>

        <NewUploadButton />
      </div>
    </div>
  );
};

export default ValidationProgress;
