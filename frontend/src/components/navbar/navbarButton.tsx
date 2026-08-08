import { NavLink } from "react-router-dom";

interface NavbarButtonProps {
  to?: string;
  icon: string;
  name: string;
  end?: boolean;
  onClick?: () => void;
}

const NavbarButton = ({ to, icon, name, end = true, onClick }: NavbarButtonProps) => {
  return (
    <li>
      {to && <NavLink
        end={end}
        to={to}
        className={({ isActive }) => `flex items-center p-2 pl-6 
        ${
          isActive
            ? "text-selected font-bold bg-selected/20"
            : "text-sublineText font-normal"
        } 
                rounded-lg hover:bg-selected/20 hover:cursor-pointer`}
      >
        <span className='material-icons'>{icon}</span>
        <p className='ml-5'>{name}</p>
      </NavLink>}
      {!to && <div
        onClick={onClick && onClick}
        className="flex items-center p-2 pl-6 text-sublineText font-normal hover:bg-selected/20 hover:cursor-pointer">
        <span className='material-icons'>{icon}</span>
        <p className='ml-5'>{name}</p>
      </div>}
    </li>
  );
};

export default NavbarButton;
