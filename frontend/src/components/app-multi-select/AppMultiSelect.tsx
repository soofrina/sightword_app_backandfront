import React, { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

import classes from "../app-select/appSelect.module.css";

import SelectOption from "../app-select/SelectOption";
import {
  getBgColor,
  getTextColor,
  getFullBorderColor,
} from "@utility/appDropdown";
import { DropdownVariant, DropdownColor } from "@base/type/appDropdown";
import { OptionData } from "@base/type/appSelect";

interface AppSelectProps {
  onChange?: (data: OptionData[]) => void;
  name?: string;
  value: OptionData[];
  data: OptionData[];
  label?: string;
  dropdownVariant?: DropdownVariant;
  dropdownColor?: DropdownColor;
  className?: string;
  isReverseDropdown?: boolean;
  rightAligned?: boolean;
  disabled?: boolean;
}
const AppMultiSelect = (props: AppSelectProps) => {
  const {
    name,
    data,
    label,
    value,
    onChange,
    dropdownVariant = DropdownVariant.SOLID,
    dropdownColor = DropdownColor.PRIMARY,
    className,
    isReverseDropdown = false,
    rightAligned = false,
    disabled = false,
  } = props;

  const [selected, setSelected] = useState<OptionData[]>(value);

  const handleChange = (data: OptionData[]) => {
    setSelected(data);
    onChange && onChange(data);
  };

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <Listbox name={name} value={selected} onChange={handleChange} disabled={disabled} multiple>
      {({ open }: { open: boolean }) => (
        <>
          <Listbox.Label className='block text-sm text-right font-medium text-gray-700'>
            {label}
          </Listbox.Label>
          <div className={`relative ${className}`}>
            <Listbox.Button
              className={`${getBgColor(dropdownColor, dropdownVariant)} 
                relative w-full cursor-default rounded-lg 
                border py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm`}
            >
              <span className='block truncate font-medium w-full'>
                {selected.length <= 0 
                  ? "No Selection" 
                  : selected.length === 1 
                    ? selected[0].name
                    : `${selected[0].name}, ...`
                }
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronUpDownIcon
                  className={`h-5 w-5 
                  ${getBgColor(dropdownColor, dropdownVariant)} border-none`}
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options
                className={`${getTextColor(dropdownColor)}
                  ${getFullBorderColor(dropdownColor)}
                  ${classes.scrollHideIE} ${classes.scrollHideChrome} 
                  ${rightAligned ? "right-0" : "left-0"} 
                  absolute z-10 min-w-full overflow-auto rounded-lg bg-white 
                  text-base mt-1 max-h-60 shadow-lg ring-1 ring-black ring-opacity-5 
                  focus:outline-none sm:text-sm border ${
                    isReverseDropdown && "bottom-11"
                  }`}
              >
                {data.map((option, index, array) => (
                  <SelectOption
                    key={option.id}
                    data={option}
                    dropdownColor={dropdownColor}
                    className={index === array.length - 1 ? "" : "border-b"}
                  />
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default AppMultiSelect;
