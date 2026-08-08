import { useState, useEffect } from "react";
import PopUpModal from "../popup-model";
import FileDndArea from "../file-dnd-area/FileDndArea";
import ValidationProgress from "./ValidationProgress";
import ProcessCsv from "./ProcessCsv";
import Typography from "@mui/material/Typography";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createStudents } from "@base/api/students";
import { createTeachers } from "@base/api/teachers";
import { createAdmins } from "@base/api/admins";

import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as FileImportIcon } from "assets/FileImport.svg";
import { ReactComponent as FileImportedIcon } from "assets/ValidationPass.svg";

export enum ImportTarget {
  STUDENT,
  TEACHER,
}

interface BulkImportPopUpProps {
  open: boolean;
  onClose: () => void;
  importTarget: ImportTarget;
}

/**
 * The process of **Bulk Import** is as follows:
 * 1. User selects a CSV file for upload by dragging or selecting through the popup
 * 2. CSV is validated upon file selection
 * 3. CSV is processed to extract data for uploading
 * 4. Request is sent with the extracted data
 */
const BulkImportPopUp = ({
  open,
  onClose,
  importTarget,
}: BulkImportPopUpProps) => {
  const [queryBulkImportStudentKey] = useState<string>("bulkImportStudent");
  const [queryBulkImportTeacherKey] = useState<string>("bulkImportTeacher");
  const [queryBulkImportAdminKey] = useState<string>("bulkImportAdmin");
  const queryClient = useQueryClient();

  const [fileChosen, setFileChosen] = useState<File>();

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);
  const [createData, setCreateData] = useState<any[]>([]);

  // May want to include an error UI state in the near future
  // eslint-disable-next-line
  const { isFetching: isFetchingStudent, refetch: refetchStudent } = useQuery(
    [queryBulkImportStudentKey],
    () => {
      if (createData.length <= 0) {
        return null;
      }

      // eslint-disable-next-line
      return createStudents(createData);
    },
    { enabled: false },
  );

  const {
    isFetching: isFetchingTeacher,
    refetch: refetchTeacher,
    data: createdTeachersData,
  } = useQuery(
    [queryBulkImportTeacherKey],
    () => {
      if (createData.length <= 0) {
        return null;
      }

      // eslint-disable-next-line
      return createTeachers(createData);
    },
    { enabled: false },
  );

  const { isFetching: isFetchingAdmins } = useQuery(
    [queryBulkImportTeacherKey, queryBulkImportAdminKey],
    () => {
      if (createData.length <= 0) {
        return null;
      }
      const adminData = createData.filter((row) => row["role"] === "admin");

      // eslint-disable-next-line
      return createAdmins(adminData);
    },
    { enabled: !!createdTeachersData },
  );

  // Returns true if API requests have ended
  const isNotFetching = () => {
    return (
      (importTarget !== ImportTarget.STUDENT || !isFetchingStudent) &&
      (importTarget !== ImportTarget.TEACHER ||
        (!isFetchingTeacher && !isFetchingAdmins))
    );
  };

  // Cancels current uploading
  const handleCancelUpload = () => {
    queryClient.cancelQueries([
      queryBulkImportStudentKey,
      queryBulkImportTeacherKey,
      queryBulkImportAdminKey,
    ]);

    resetStates();
  };

  // Reset states if modal is closed by user interactions
  const onCloseBulkImport = () => {
    handleCancelUpload();

    onClose();
  };

  const resetStates = () => {
    setFileChosen(undefined);
    setValidationSuccess(false);
  };

  // start validation after file selection
  useEffect(() => {
    if (fileChosen === undefined) return;

    setIsValidating(true);
  }, [fileChosen]);

  // trigger the upload API call after CSV has been proccessed
  useEffect(() => {
    if (importTarget === ImportTarget.STUDENT) {
      refetchStudent();
    } else if (importTarget === ImportTarget.TEACHER) {
      refetchTeacher();
    }
  }, [createData]);

  return (
    <>
      <PopUpModal
        popUpTitle='Bulk Import'
        open={open}
        onClose={onCloseBulkImport}
      >
        <div className='flex flex-col items-center gap-7 w-full h-full mt-16'>
          <SvgIcon
            component={FileImportIcon}
            viewBox='0 0 108 107'
            sx={{ width: "100px", height: "100px" }}
          />

          {fileChosen === undefined && (
            <FileDndArea
              setFileChosen={setFileChosen}
              text={`Drop your .CSV file to create new ${
                importTarget === ImportTarget.STUDENT
                  ? "students"
                  : "teachers/administrators"
              }`}
              accept='.csv'
            />
          )}

          {fileChosen != undefined && isValidating && (
            <ValidationProgress
              importTarget={importTarget}
              fileChosen={fileChosen}
              setIsValidating={setIsValidating}
              setValidationSuccess={setValidationSuccess}
              resetFileChosen={() => setFileChosen(undefined)}
            />
          )}

          {fileChosen != undefined &&
            !isValidating &&
            validationSuccess &&
            createData.length <= 0 &&
            isNotFetching() && (
              <ProcessCsv
                columns={
                  importTarget === ImportTarget.STUDENT
                    ? ["name", "email", "student_id"]
                    : ["name", "email", "staff_id", "role"]
                }
                fileChosen={fileChosen}
                validationSuccess={validationSuccess}
                setCreateData={setCreateData}
                handleCancelUpload={handleCancelUpload}
              />
            )}

          {fileChosen != undefined &&
            !isValidating &&
            validationSuccess &&
            isNotFetching() && (
              <div className='flex flex-row justify-center gap-10 w-full h-full'>
                <Typography variant='caption' className='text-center'>
                  {fileChosen?.name}
                </Typography>
                <div className='flex flex-row justify-start items-center gap-3'>
                  <Typography variant='caption' className='text-center'>
                    Uploaded!
                  </Typography>
                  <SvgIcon
                    component={FileImportedIcon}
                    viewBox='0 0 25 25'
                    sx={{ width: "25px" }}
                  />
                </div>
              </div>
            )}
        </div>
      </PopUpModal>
    </>
  );
};

export default BulkImportPopUp;
