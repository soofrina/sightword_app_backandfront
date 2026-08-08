import { OptionData, OptionDataRole } from "@type/createClassPopUp";
import WordItem from "@components/word-item";
import { useRecoilState } from "recoil";
import {
  createClassStudentsSelector,
  createClassTeachersSelector,
} from "@recoil/create-class";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
  Typography,
} from "@mui/material";
import { StudentData, TeacherData } from "@base/type/dataTypes";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@base/api/students";
import { getAllTeachers } from "@base/api/teachers";

const AddStudentTeachersManual = () => {
  const [selectedStudents, setSelectedStudents] = useRecoilState(
    createClassStudentsSelector,
  );
  const [selectedTeachers, setSelectedTeachers] = useRecoilState(
    createClassTeachersSelector,
  );

  const removeFromSelected = (key: string, role: OptionDataRole) => {
    if (role === OptionDataRole.STUDENT) {
      setSelectedStudents(selectedStudents.filter((d) => d.email != key));
    } else if (role === OptionDataRole.TEACHER) {
      setSelectedTeachers(selectedTeachers.filter((d) => d.email != key));
    }
  };

  const getOptionLabel = (option: string | StudentData | TeacherData) => {
    if (typeof option === "string") {
      return option;
    }
    return option.name;
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: StudentData | TeacherData,
  ) => (
    <Typography key={option.id} style={{ fontSize: 12 }} {...props}>
      {option.name}
    </Typography>
  );

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      InputProps={{ ...params.InputProps, style: { fontSize: 12 } }}
      className='w-40'
    />
  );

  const { data: students } = useQuery({
    queryKey: ["getAllStudents"],
    queryFn: () => getAllStudents(),
  });

  const { data: teachers } = useQuery({
    queryKey: ["getAllTeachers"],
    queryFn: () => getAllTeachers(),
  });

  return (
    <>
      <div className='flex'>
        <div>
          <p className='font-bold'>Students</p>
          <Autocomplete
            size='small'
            freeSolo
            id='free-solo-demo'
            options={
              students
                ? students.data.filter(
                    (s) =>
                      !selectedStudents.map((e) => e.email).includes(s.email),
                  )
                : []
            }
            onChange={(_, newValue) => {
              if (newValue && typeof newValue !== "string") {
                const newStudent = newValue as StudentData;
                const newStudentToAdd: OptionData = {
                  id: newStudent.id,
                  email: newStudent.email,
                  name: newStudent.name,
                  role: OptionDataRole.STUDENT,
                };
                setSelectedStudents([...selectedStudents, newStudentToAdd]);
              }
            }}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            selectOnFocus
            renderInput={renderInput}
            sx={{ fontSize: 12 }}
          />
          <div className='w-52 h-48 overflow-y-auto'>
            {selectedStudents.length > 0 && (
              <>
                {selectedStudents.map((d) => (
                  <WordItem
                    onClickIcon={() => removeFromSelected(d.email, d.role)}
                    icon='close'
                    key={d.email}
                    word={d.name}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <div>
          <p className='font-bold'>Teachers</p>
          <Autocomplete
            size='small'
            freeSolo
            id='free-solo-demo'
            options={
              teachers
                ? teachers.data.filter(
                    (s: TeacherData) =>
                      !selectedTeachers.map((e) => e.email).includes(s.email),
                  )
                : []
            }
            onChange={(_, newValue) => {
              if (newValue && typeof newValue !== "string") {
                const newTeacher = newValue as TeacherData;
                const newTeacherToAdd: OptionData = {
                  id: newTeacher.id,
                  email: newTeacher.email,
                  name: newTeacher.name,
                  role: OptionDataRole.TEACHER,
                };
                setSelectedTeachers([...selectedTeachers, newTeacherToAdd]);
              }
            }}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            selectOnFocus
            renderInput={renderInput}
            sx={{ fontSize: 12 }}
          />
          <div className='w-52 h-48 overflow-y-auto'>
            {selectedTeachers.length > 0 && (
              <>
                {selectedTeachers.map((d) => (
                  <WordItem
                    onClickIcon={() => removeFromSelected(d.email, d.role)}
                    icon='close'
                    key={d.email}
                    word={d.name}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudentTeachersManual;
