import { ButtonVariant } from "@type/appButton";
import AppButton from "@components/app-button";
import {
  expectedHeaders,
  IMPORT_INVALID_EMAIL,
  IMPORT_INVALID_HEADERS,
  IMPORT_INVALID_ROLE,
  OptionData,
  OptionDataRole,
} from "@type/createClassPopUp";
import { useRef, useState } from "react";
import { SvgIcon, Typography } from "@mui/material";
import { ReactComponent as FileImportIcon } from "assets/FileImport.svg";
import { handleParse } from "@base/utility/csvParser";
import { ParseError } from "papaparse";
import { isEmailValid } from "@base/utility/common";
import WordItem from "@components/word-item/wordItem";
import { ReactComponent as FileImportedIcon } from "assets/FileImported.svg";
import {
  createClassStudentsSelector,
  createClassTeachersSelector,
} from "@recoil/create-class";
import { useRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@base/api/students";
import { getAllTeachers } from "@base/api/teachers";

const AddStudentsTeachersImport = () => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [fileChosen, setFileChosen] = useState<File>();

  const [importError, setImportError] = useState<string>("");

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [selectedStudents, setSelectedStudents] = useRecoilState(
    createClassStudentsSelector,
  );
  const [selectedTeachers, setSelectedTeachers] = useRecoilState(
    createClassTeachersSelector,
  );

  // workaround for a custom input button
  const handleUploadOnClick = () => {
    if (fileUploadRef.current !== null) {
      fileUploadRef.current.click();
    }
  };

  // User selects a file
  const handleFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const uploadedFile = event.target.files[0];

      setFileChosen(uploadedFile);
      handleParse(uploadedFile, validateCsv, extractDataFromCsv);
    }
  };

  // Validates the csv file uploaded to add students and teachers
  const validateCsv = (
    data: OptionData[],
    headers: string[],
    errors?: ParseError[],
  ) => {
    // Check that there are no parsing errors
    if (errors && errors.length > 0) {
      console.log(errors);
      setFileChosen(undefined);
      setImportError(errors[0].message);
      return false;
    }

    // Compares between file headers and expected headers
    const isHeadersCorrect = headers.every(
      (val, i) => val === expectedHeaders[i],
    );

    if (!isHeadersCorrect) {
      setFileChosen(undefined);
      setImportError(IMPORT_INVALID_HEADERS);
      return false;
    }

    // Checks that each entry has a valid email address
    let isAllEmailValid = true;
    let isAllRolesValid = true;
    data.every((d) => {
      if (!isEmailValid(d.email)) {
        setFileChosen(undefined);
        setImportError(IMPORT_INVALID_EMAIL);
        isAllEmailValid = false;
        return false;
      } else if (!Object.values(OptionDataRole).includes(d.role)) {
        setFileChosen(undefined);
        setImportError(IMPORT_INVALID_ROLE);
        isAllRolesValid = false;
        return false;
      }
      return true;
    });

    if (!isAllEmailValid || !isAllRolesValid) {
      return false;
    }

    setImportError("");

    return true;
  };

  const extractDataFromCsv = (data: OptionData[], file: File) => {
    setUploadedFiles([...uploadedFiles.slice(-2), file.name]);
    const students = data.filter((d) => d.role === OptionDataRole.STUDENT);
    const teachers = data.filter((d) => d.role === OptionDataRole.TEACHER);
    const existingStudents = new Set(selectedStudents.map((d) => d.email));
    const existingTeachers = new Set(selectedTeachers.map((d) => d.email));

    // Only take the unique new students/teachers from the csv file
    setSelectedStudents([
      ...selectedStudents,
      ...students.filter(
        (d) =>
          !existingStudents.has(d.email) &&
          studentsData?.data.some(
            (s) => s.id === d.id && s.email === d.email && s.name === d.name,
          ),
      ),
    ]);
    setSelectedTeachers([
      ...selectedTeachers,
      ...teachers.filter(
        (d) =>
          !existingTeachers.has(d.email) &&
          teachersData?.data.some(
            (t) => t.id === d.id && t.email === d.email && t.name === d.name,
          ),
      ),
    ]);
    setFileChosen(undefined);
  };

  const removeFromSelected = (key: string, role: OptionDataRole) => {
    if (role === OptionDataRole.STUDENT) {
      setSelectedStudents(selectedStudents.filter((d) => d.email != key));
    } else if (role === OptionDataRole.TEACHER) {
      setSelectedTeachers(selectedTeachers.filter((d) => d.email != key));
    }
  };

  const { data: studentsData } = useQuery({
    queryKey: ["getAllStudents"],
    queryFn: () => getAllStudents(),
  });

  const { data: teachersData } = useQuery({
    queryKey: ["getAllTeachers"],
    queryFn: () => getAllTeachers(),
  });

  return (
    <>
      <>
        <SvgIcon
          component={FileImportIcon}
          viewBox='0 0 108 107'
          sx={{ width: "30px", height: "30px" }}
        />
        {fileChosen === undefined && (
          <>
            <input
              ref={fileUploadRef}
              style={{ display: "none" }}
              type='file'
              accept='.csv'
              onChange={handleFileChosen}
            />
            <AppButton
              className='py-2 px-3 ml-4'
              variant={ButtonVariant.OUTLINED}
              onClick={handleUploadOnClick}
            >
              {selectedStudents.length === 0 && selectedTeachers.length === 0
                ? "Upload File"
                : "Upload Another File"}
            </AppButton>
            <p className='text-sublineText ml-12 mt-2'>
              Upload .csv files only
            </p>
            <Typography className='text-xs text-red-600'>
              {importError}
            </Typography>
          </>
        )}
      </>
      <div className='h-32 flex mt-4'>
        <div className='w-52'>
          {selectedStudents.length > 0 && (
            <>
              <p className='font-bold'>Students</p>
              <div className='w-52 h-28 overflow-y-auto'>
                {selectedStudents.map((d) => (
                  <WordItem
                    onClickIcon={() => removeFromSelected(d.email, d.role)}
                    icon='close'
                    key={d.email}
                    word={d.name}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className='w-52'>
          {selectedTeachers.length > 0 && (
            <>
              <p className='font-bold'>Teachers</p>
              <div className='w-52 h-28 overflow-y-auto'>
                {selectedTeachers.map((d) => (
                  <WordItem
                    onClickIcon={() => removeFromSelected(d.email, d.role)}
                    icon='close'
                    key={d.email}
                    word={d.name}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className='mt-2'>
        {uploadedFiles.map((f, idx) => (
          <div className='flex' key={`uploaded-${idx}`}>
            <p className='mr-5'>{f}</p>
            <SvgIcon
              className='mx-1'
              component={FileImportedIcon}
              viewBox='0 0 17 17'
              sx={{ width: "10px" }}
            />
            <Typography variant='caption' className='text-sublineText'>
              Uploaded!
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
};

export default AddStudentsTeachersImport;
