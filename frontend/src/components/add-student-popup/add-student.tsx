import React, { useState, useEffect } from "react";
import WordItem from "@components/word-item";
import { useRecoilState } from "recoil";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
  Typography,
} from "@mui/material";
import { StudentData } from "@base/type/dataTypes";
import { addStudentSelector } from "@recoil/add-student";
import AppButton from "@components/app-button";
import { ButtonVariant } from "@type/appButton";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@base/api/students";

interface AddStudentProps {
  handleAdd: () => void;
  handleCancel: () => void;
  excludedStudents: StudentData[] | undefined;
}

const AddStudent = ({
  handleAdd,
  handleCancel,
  excludedStudents,
}: AddStudentProps) => {
  const [selectedStudents, setSelectedStudents] =
    useRecoilState(addStudentSelector);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);

  const removeFromSelected = (key: string) => {
    setSelectedStudents(selectedStudents.filter((d) => d.email != key));
  };

  const getOptionLabel = (option: string | StudentData) => {
    if (typeof option === "string") {
      return option;
    }
    return option.name;
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      InputProps={{ ...params.InputProps, style: { fontSize: 12 } }}
    />
  );

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: StudentData,
  ) => (
    <Typography key={option.id} style={{ fontSize: 12 }} {...props}>
      {option.name}
    </Typography>
  );

  const getStudents = useQuery({
    enabled: allStudents.length === 0,
    queryKey: ["getAllStudents"],
    retry: 3,
    queryFn: () => getAllStudents(),
  });

  useEffect(() => {
    if (!getStudents.isLoading && getStudents.data) {
      let students = getStudents.data.data;
      if (excludedStudents) {
        // remove excluded students from the students list
        students = students.filter(
          (student) =>
            excludedStudents.findIndex((s) => s.id === student.id) < 0,
        );
      }
      setAllStudents(students);
    }
  }, [getStudents.isLoading]);

  // TODO: Popup Modal can me improved. Requires hardcode to make it expand (h-96). This problem occurs in other places too.
  return (
    <div className='flex flex-col items-center justify-center min-w-full align-self-center h-96'>
      <p className='font-bold text-center pb-4'>Students</p>
      <Autocomplete
        className='w-1/2 bg-white'
        multiple
        value={selectedStudents}
        isOptionEqualToValue={(option, value) => option.email === value.email}
        id='add-student'
        options={allStudents}
        onChange={(event, newValue) => {
          if (newValue && typeof newValue !== "string") {
            const newStudents = newValue as StudentData[];
            setSelectedStudents(newStudents);
          }
        }}
        renderTags={(values) =>
          values.map((option) => (
            <WordItem
              onClickIcon={() => removeFromSelected(option.email)}
              icon='close'
              key={option.email}
              word={option.name}
            />
          ))
        }
        getOptionLabel={getOptionLabel}
        selectOnFocus
        renderOption={renderOption}
        renderInput={renderInput}
        sx={{ fontSize: 12 }}
      />
      <div className='self-end mt-auto'>
        <AppButton
          className='m-2'
          variant={ButtonVariant.OUTLINED}
          onClick={handleCancel}
        >
          Cancel
        </AppButton>
        <AppButton
          className='m-2'
          variant={ButtonVariant.SOLID}
          onClick={handleAdd}
        >
          Add
        </AppButton>
      </div>
    </div>
  );
};

export default AddStudent;
