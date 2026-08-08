import NavbarButton from "@components/navbar/navbarButton";
import { Avatar, Box } from "@mui/material";
import { staffRoutes, studentRoutes } from "@constants/routes";

import avatar from "@assets/avatar.png";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import themeAtom from "@recoil/theme/atom";
import { getTheme } from "@base/utility/theme";
import { userAtom } from "@recoil/user";
import { getAvatar } from "@base/utility/common";
import { Role } from "@base/type/user";

interface NavbarTab {
  name: string;
  icon: string;
  to: string;
  end: boolean;
}

const teacherTabs: NavbarTab[] = [
  {
    name: "Home",
    icon: "home",
    to: staffRoutes.base,
    end: true,
  },
  {
    name: "Class",
    icon: "child_care",
    to: staffRoutes.class,
    end: false,
  },
  {
    name: "Organisation",
    icon: "people",
    to: staffRoutes.organisation,
    end: true,
  },
  {
    name: "Word Bank",
    icon: "class",
    to: staffRoutes.wordBank,
    end: true,
  },
];

const studentTabs: NavbarTab[] = [
  {
    name: "Home",
    icon: "home",
    to: studentRoutes.base,
    end: true,
  },
  {
    name: "Words",
    icon: "list",
    to: studentRoutes.words,
    end: true,
  },
];

interface SideNavbarProps {
  isTeacher?: boolean;
  className?: string;
}

const SideNavbar = ({ isTeacher = false, className = "" }: SideNavbarProps) => {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const user = useRecoilValue(userAtom);
  const logoutUser = useResetRecoilState(userAtom);

  const swapThemes = () => {
    const isLight = theme.palette?.mode === "light";
    const newMode = isLight ? "dark" : "light";
    const newTheme = getTheme(newMode);
    setTheme(newTheme);
  };
  const getUserName = () => {
    // priority of teacher, student, admin
    let roleName = user.roleNames.find((e) => e.role === "teacher");
    if (roleName && roleName.name) {
      return roleName.name;
    }
    roleName = user.roleNames.find((e) => e.role === "student");
    if (roleName && roleName.name) {
      return roleName.name;
    }

    return "Admin";
  };

  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        zIndex: 9999, // always on top
      }}
      className={`flex flex-col h-screen select-none fixed ${className}`}
    >
      <div className='flex flex-col justify-center items-center h-40'>
        <Avatar className='w-16 h-16 mb-2' src={getAvatar(getUserName())} />
        <p>{getUserName()}</p>
      </div>
      <hr className='ml-12 w-36' />
      <div className='grow py-4 px-3'>
        <ul className='space-y-2'>
          {isTeacher &&
            teacherTabs.map((tab) => (
              <NavbarButton
                key={tab.name}
                to={tab.to}
                icon={tab.icon}
                name={tab.name}
                end={tab.end}
              />
            ))}
          {!isTeacher &&
            studentTabs.map((tab) => (
              <NavbarButton
                key={tab.name}
                to={tab.to}
                icon={tab.icon}
                name={tab.name}
                end={tab.end}
              />
            ))}
        </ul>
      </div>
      <div className='h-40 px-3'>
        <hr className='ml-12 w-36 mb-7' />
        <ul className='space-y-2'>
          {!isTeacher && (
            <NavbarButton
              to={studentRoutes.settings}
              icon='settings'
              name='Settings'
            />
          )}
          {/* {isTeacher && (
            <NavbarButton
              onClick={swapThemes}
              icon={`${
                theme.palette?.mode === "light" ? "toggle_off" : "toggle_on"
              }`}
              name={`${
                theme.palette?.mode === "light" ? "Light Mode" : "Dark Mode"
              }`}
            />
          )} */}
          <NavbarButton
            onClick={() => logoutUser()}
            icon='logout'
            name='Log out'
          />
        </ul>
      </div>
    </Box>
  );
};

export default SideNavbar;
