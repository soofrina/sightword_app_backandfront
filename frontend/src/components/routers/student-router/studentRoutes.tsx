import StudentOngoingClassPage from "@base/pages/student-ongoing-class-page/studentOngoingClassPage";
import StudentHomePage from "@base/pages/student-home-page/studentHomePage";
import { studentRoutes } from "@base/constants/routes";
import { Route } from "react-router-dom";
import StudentSettingsPage from "@base/pages/student-settings/StudentSettings";
import ReviewWordsPage from "@pages/review-words-page";
import ClassWordsPage from "@base/pages/class-words-page/classWordsPage";

const StudentRoutes = [
  <Route
    key={studentRoutes.base}
    path={studentRoutes.base}
    element={<StudentHomePage />}
  />,
  <Route
    key={studentRoutes.words}
    path={studentRoutes.words}
    element={<ReviewWordsPage />}
  />,
  <Route
    key={studentRoutes.settings}
    path={studentRoutes.settings}
    element={<StudentSettingsPage />}
  />,
  <Route
    key={studentRoutes.lessonDetails}
    path={`${studentRoutes.lessonDetails}/:id`}
    element={<StudentOngoingClassPage />}
  />,
  <Route
    key={studentRoutes.classWords}
    path={`${studentRoutes.classWords}/:id`}
    element={<ClassWordsPage />}
  />,
];

export default StudentRoutes;
