import { Route } from "react-router-dom";
import { staffRoutes } from "@constants/routes";
import StaffHome from "@pages/home-page";
import StaffTest from "@pages/test-page";
import StaffClass from "@pages/class-page";
import StaffViewClass from "@pages/class-page/view-class-page";
import StaffOrganisation from "@pages/organisation-page";
import StaffWordBank from "@pages/word-bank-page";

const Placeholder = () => (
  <div>
    <h1>This page has not been created.</h1>
  </div>
);

const TeacherRoutes = [
  <Route
    key={staffRoutes.base}
    path={staffRoutes.base}
    element={<StaffHome />}
  />,
  <Route
    key={staffRoutes.test}
    path={staffRoutes.test}
    element={<StaffTest />}
  />,
  <Route
    key={staffRoutes.class}
    path={staffRoutes.class}
    element={<StaffClass />}
  />,
  <Route
    key={staffRoutes.viewClass}
    path={`${staffRoutes.viewClass}/:classId`}
    element={<StaffViewClass />}
  />,
  <Route
    key={staffRoutes.organisation}
    path={staffRoutes.organisation}
    element={<StaffOrganisation />}
  />,
  <Route
    key={staffRoutes.wordBank}
    path={staffRoutes.wordBank}
    element={<StaffWordBank />}
  />,
  <Route
    key={staffRoutes.settings}
    path={staffRoutes.settings}
    element={<Placeholder />}
  />,
  <Route
    key={staffRoutes.logout}
    path={staffRoutes.logout}
    element={<Placeholder />}
  />,
];

export default TeacherRoutes;
