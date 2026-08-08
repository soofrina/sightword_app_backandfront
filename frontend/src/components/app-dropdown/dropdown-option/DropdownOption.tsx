import React from "react";
import { Menu } from "@headlessui/react";

import { getBottomBorderColor, classNames } from "@utility/appDropdown";
import { DropdownColor, OptionData } from "@base/type/appDropdown";

interface AppOptionProps {
  data: OptionData;
  dropdownColor?: DropdownColor;
  className?: string;
}

const DropdownOption = ({
  data,
  dropdownColor = DropdownColor.PRIMARY,
  className,
}: AppOptionProps) => {
  const getOptionClasses = (active: boolean): string => {
    let selectedClass = "";
    if (active && dropdownColor === DropdownColor.PRIMARY) {
      selectedClass = "bg-primaryMainHover";
    }
    if (active && dropdownColor === DropdownColor.SECONDARY) {
      selectedClass = "bg-secondaryMainHover text-white";
    }

    return selectedClass;
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <a
          onClick={data.onClick}
          href={data.href}
          className={classNames(
            getOptionClasses(active),
            getBottomBorderColor(dropdownColor),
            className ?? "",
            "block px-4 py-2 text-sm cursor-pointer",
          )}
        >
          {data.title}
        </a>
      )}
    </Menu.Item>
  );
};

export default DropdownOption;
