import WordItem from "@components/word-item";
import { useRecoilState } from "recoil";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
  Typography,
} from "@mui/material";
import { TeacherData } from "@base/type/dataTypes";
import { addTeacherSelector } from "@recoil/add-teacher";
import AppButton from "@components/app-button";
import { ButtonVariant } from "@type/appButton";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "@base/api/teachers";

interface AddTeacherProps {
  handleAdd: () => void;
  handleCancel: () => void;
  excludedTeachers: TeacherData[] | undefined;
}

const AddTeacher = ({
  handleAdd,
  handleCancel,
  excludedTeachers,
}: AddTeacherProps) => {
  const [selectedTeachers, setSelectedTeachers] =
    useRecoilState(addTeacherSelector);
  const [allTeachers, setAllTeachers] = useState<TeacherData[]>([]);

  const removeFromSelected = (key: string) => {
    setSelectedTeachers((s) =>
      s.filter((d) => {
        return d.email !== key;
      }),
    );
  };

  const getOptionLabel = (option: string | TeacherData) => {
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
    option: TeacherData,
  ) => (
    <Typography key={option.id} style={{ fontSize: 12 }} {...props}>
      {option.name}
    </Typography>
  );

  const getTeachers = useQuery({
    enabled: allTeachers.length === 0,
    queryKey: ["getAllTeachers"],
    retry: 3,
    queryFn: () => getAllTeachers(),
  });

  useEffect(() => {
    if (!getTeachers.isLoading && getTeachers.data) {
      let teachers = getTeachers.data.data;
      if (excludedTeachers) {
        // remove excluded students from the students list
        teachers = teachers.filter(
          (teachers) =>
            excludedTeachers.findIndex((t) => t.id === teachers.id) < 0,
        );
      }
      setAllTeachers(teachers);
    }
  }, [getTeachers.isLoading]);

  return (
    <div className='flex flex-col items-center justify-center min-w-full align-self-center h-96'>
      <p className='font-bold text-center pb-4'>Teachers</p>
      <Autocomplete
        className='w-1/2 bg-white'
        value={selectedTeachers as TeacherData[]}
        multiple
        isOptionEqualToValue={(option, value) => option.email === value.email}
        id='add-teacher'
        options={allTeachers}
        onChange={(event, newValue) => {
          if (newValue && typeof newValue !== "string") {
            const newTeachers = newValue as TeacherData[];
            setSelectedTeachers(newTeachers);
          }
        }}
        renderTags={() =>
          selectedTeachers.map((option) => (
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

export default AddTeacher;
