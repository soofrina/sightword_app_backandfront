import { AppBar, Toolbar } from "@mui/material";
import { studentRoutes } from "@constants/routes";

import AppNavbarButton from "@base/components/app-navbar/appNavbarButton";

interface BottomNavbarProps {
  className: string;
}

const BottomNavbar = ({ className }: BottomNavbarProps) => {
  return (
    <AppBar
      position='fixed'
      sx={{
        top: "auto",
        bottom: 0,
        left: 0,
        zIndex: 9999, // always on top
      }}
      className={`z-50 bg-white ${className} w-screen`}
    >
      <Toolbar className={`flex justify-around ${className}`}>
        <AppNavbarButton to={studentRoutes.base} icon='home' name='Home' />
        <AppNavbarButton to={studentRoutes.words} icon='toc' name='Words' />
        <AppNavbarButton
          to={studentRoutes.settings}
          icon='settings'
          name='Settings'
        />
      </Toolbar>
    </AppBar>
  );
};
export default BottomNavbar;
