import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import DropdownOption from "./dropdown-option/DropdownOption";

import {
  getBgColor,
  getTextColor,
  getFullBorderColor,
  classNames,
} from "@utility/appDropdown";
import {
  DropdownVariant,
  DropdownColor,
  OptionData,
} from "@base/type/appDropdown";

interface AppDropdownProps {
  title: string;
  data: OptionData[];
  dropdownVariant?: DropdownVariant;
  dropdownColor?: DropdownColor;
  className?: string;
  rightAligned?: boolean;
  disabled?: boolean;
}

const AppDropdown = ({
  data,
  title,
  dropdownVariant = DropdownVariant.SOLID,
  dropdownColor = DropdownColor.PRIMARY,
  className,
  rightAligned = false,
  disabled = false,
}: AppDropdownProps) => {
  return (
    <Menu as='div' className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button
          className={`${getBgColor(dropdownColor, dropdownVariant)} 
            inline-flex w-full justify-center rounded-md border 
            px-4 py-2 text-sm font-medium shadow-sm`}
          disabled={disabled}
        >
          {title}
          <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className={`${getTextColor(dropdownColor)}
            ${getFullBorderColor(dropdownColor)}
            ${rightAligned ? "right-0" : "left-0"} 
            absolute min-w-full z-10 mt-1 bg-white
            border origin-top-left rounded-md overflow-hidden shadow-lg 
            ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div>
            {data.map((option, index, array) => (
              <DropdownOption
                key={option.id}
                data={option}
                dropdownColor={dropdownColor}
                className={`${classNames(
                  index === 0 ? "rounded-t-sm" : "",
                  index === array.length - 1 ? "rounded-b-sm" : "border-b",
                )}`}
              />
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AppDropdown;
