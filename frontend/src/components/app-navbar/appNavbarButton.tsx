import { NavLink } from "react-router-dom";
import Stack from "@mui/material/Stack";

interface AppNavbarButtonProps {
  to: string;
  icon: string;
  name: string;
}

const AppNavbarButton = ({ to, icon, name }: AppNavbarButtonProps) => {
  return (
    <NavLink
      end
      to={to}
      className={({ isActive }) => `flex justify-items-center 
        ${
          isActive ? "text-selected font-bold" : "text-sublineText font-normal"
        } `}
    >
      <Stack className='flex justify-items-center'>
        <span className='self-center material-icons'>{icon}</span>
        <p className='self-center'>{name}</p>
      </Stack>
    </NavLink>
  );
};

export default AppNavbarButton;
