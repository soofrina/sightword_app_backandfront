import { useState } from "react";
import { Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import StudentTab from "./student/studentTab";
import TeacherTab from "./teacher/teacherTab";
import LearningCentreTab from "./learningCentre/learningCentreTab";

const Organisation = () => {
  const [value, setValue] = useState<string>("student");

  const tabsOnChange = (event: React.SyntheticEvent, value: string) =>
    setValue(value);

  return (
    <>
      <div className='ml-8 w-full h-full flex flex-col gap-10 px-5 pt-10 pb-2 bg-backgroundDefault dark:bg-backgroundDefault-d overflow-y-auto min-w-[1050px]'>
        <Typography variant='h4' sx={{ fontWeight: "bold" }}>
          Organisation
        </Typography>

        <div className='w-full flex-grow flex flex-col rounded-md overflow-hidden'>
          <Tabs
            value={value}
            onChange={tabsOnChange}
            className='min-h-0 bg-white dark:bg-primaryLight-d'
            TabIndicatorProps={{
              style: {
                backgroundColor: "#f4a295",
              },
            }}
            sx={{
              "& * .MuiTab-root.Mui-selected": {
                color: "#f4a295",
              },
            }}
          >
            <Tab
              className='py-2 min-h-0 normal-case'
              value='student'
              label='Student'
            />
            <Tab
              className='py-2 min-h-0 normal-case'
              value='teacher'
              label='Teacher'
            />
            <Tab
              className='py-2 min-h-0 normal-case'
              value='learningCentre'
              label='LC'
            />
          </Tabs>
          {value === "student" && <StudentTab />}
          {value === "teacher" && <TeacherTab />}
          {value === "learningCentre" && <LearningCentreTab />}
        </div>
      </div>
    </>
  );
};

export default Organisation;
