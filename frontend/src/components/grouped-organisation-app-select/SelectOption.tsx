import React from "react";
import { Listbox } from "@headlessui/react";

import { DropdownColor } from "@base/type/appDropdown";
import { OptionData } from "@base/type/appSelect";
import { getBottomBorderColor, classNames } from "@utility/appDropdown";

interface OptionClasses {
  selected: boolean;
  active: boolean;
}

interface OptionProps {
  data: OptionData;
  dropdownColor: DropdownColor;
  className?: string;
}

const SelectOption = ({ data, dropdownColor, className }: OptionProps) => {
  const getOptionClasses = ({ selected, active }: OptionClasses): string => {
    let selectedClass = "";
    if (selected && !active) {
      if (dropdownColor === DropdownColor.PRIMARY) {
        selectedClass = "bg-primaryMainSelected";
      } else if (dropdownColor === DropdownColor.SECONDARY) {
        selectedClass = "bg-secondaryMainSelected";
      }
    }

    if ((active && selected) || active) {
      if (dropdownColor === DropdownColor.PRIMARY) {
        selectedClass = "bg-primaryMainHover";
      } else if (dropdownColor === DropdownColor.SECONDARY) {
        selectedClass = "bg-secondaryMainHover text-white";
      }
    }

    return classNames(
      selectedClass,
      "relative cursor-default select-none py-2 pl-3 pr-2",
    );
  };

  return (
    <Listbox.Option
      key={data.id}
      className={(params: OptionClasses) => {
        return `${getOptionClasses(params)} 
          ${getBottomBorderColor(dropdownColor)}
          ${className}`;
      }}
      value={data}
    >
      {({ selected }: { selected: boolean }) => (
        <>
          <span
            className={classNames(
              selected ? "font-bold " : "font-normal",
              "block truncate",
            )}
          >
            {data.renderFn ? data.renderFn({ name: data.name }) : data.name}
          </span>
        </>
      )}
    </Listbox.Option>
  );
};

export default SelectOption;
