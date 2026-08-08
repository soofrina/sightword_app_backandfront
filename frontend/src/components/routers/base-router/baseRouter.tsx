import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { staffRoutes, studentRoutes } from "@constants/routes";
import SideNavbar from "@components/navbar";
import StudentRoutes from "@components/routers/student-router";
import TeacherRoutes from "@components/routers/teacher-router";
import BottomNavbar from "@components/app-navbar";
import Journey from "@pages/lesson-journey-page";
import LoginPage from "@base/pages/login-page";
import ErrorPage from "@base/pages/error-page";
import ProtectedRoute from "./protectedRoute";
import { Role } from "@base/type/user";
import { useEffect, useState } from "react";

const ALLOW_ALL_ROLES: Array<Role> = ["teacher", "admin", "student"];
const RESTRICTED_ROLES: Array<Role> = ["teacher", "admin"];

const BaseRouter = () => {
  const [isSideNavbarVisible, setIsSideNavbarVisible] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1145) {
      setIsSideNavbarVisible(false);
    } else {
      setIsSideNavbarVisible(true);
    }

    const handleResize = () => {
      if (window.innerWidth < 1145) {
        setIsSideNavbarVisible(false);
      } else {
        setIsSideNavbarVisible(true);
      }
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  const StaffLayout = () => (
    <div className='flex h-screen'>
      <SideNavbar isTeacher />
      <div className={"w-[216px] flex-shrink-0"}></div>
      <div className='flex-grow overflow-y-auto'>
        <Outlet />
      </div>
    </div>
  );

  const StudentLayout = () => (
    <div className='flex min-h-screen w-screen'>
      <SideNavbar className={`${isSideNavbarVisible ? "" : "hidden"}`} />
      <div
        className={`${
          isSideNavbarVisible ? "w-[216px] flex-shrink-0" : "hidden"
        }`}
      ></div>
      {/* Placeholder */}
      <BottomNavbar className={`${isSideNavbarVisible ? "hidden" : ""}`} />
      <div className='flex-grow overflow-y-auto'>
        <Outlet />
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/login"} element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute allowedRoles={ALLOW_ALL_ROLES}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          {StudentRoutes}
        </Route>
        {/* Place pages which don't use the Student Navbar layout here:  */}
        <Route
          path={studentRoutes.lessonLearningJourney}
          element={
            <ProtectedRoute allowedRoles={ALLOW_ALL_ROLES}>
              <Journey />
            </ProtectedRoute>
          }
        />
        <Route
          path={studentRoutes.wordLearningJourney}
          element={
            <ProtectedRoute allowedRoles={ALLOW_ALL_ROLES}>
              <Journey />
            </ProtectedRoute>
          }
        />
        <Route
          path={staffRoutes.base}
          element={
            <ProtectedRoute allowedRoles={RESTRICTED_ROLES}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          {TeacherRoutes}
        </Route>
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default BaseRouter;
