import React, { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

import classes from "./appSelect.module.css";

import SelectOption from "./SelectOption";
import {
  getBgColor,
  getTextColor,
  getFullBorderColor,
} from "@utility/appDropdown";
import { DropdownVariant, DropdownColor } from "@base/type/appDropdown";
import { OptionData } from "@base/type/appSelect";

interface GroupedSelectOptionProps {
  label: string;
  options: OptionData[];
  dropdownColor: DropdownColor;
}

// New component to handle grouped options
const GroupedSelectOption = ({
  label,
  options,
  dropdownColor,
}: GroupedSelectOptionProps) => (
  <div className='px-4 py-2'>
    <p className='text-gray-900 font-semibold backdrop-none'>{label}</p>
    <div className='pl-4'>
      {options.map((option) => (
        <SelectOption
          key={option.id}
          data={option}
          dropdownColor={dropdownColor}
        />
      ))}
    </div>
  </div>
);

interface AppSelectProps {
  onChange?: (data: OptionData) => void;
  name?: string;
  value: OptionData | null;
  data: { label: string; options: OptionData[] }[];
  label?: string;
  dropdownVariant?: DropdownVariant;
  dropdownColor?: DropdownColor;
  className?: string;
  isReverseDropdown?: boolean;
  rightAligned?: boolean;
  disabled?: boolean;
}

const GroupedAppSelect = (props: AppSelectProps) => {
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

  const [selected, setSelected] = useState<OptionData | null>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (data: OptionData) => {
    setSelected(data);
    onChange && onChange(data);
  };

  return (
    <Listbox
      name={name}
      value={selected}
      onChange={handleChange}
      disabled={disabled}
    >
      {({ open }: { open: boolean }) => (
        <>
          <Listbox.Label
            className={`${
              label === undefined ? "hidden" : "block"
            } text-sm text-right font-medium text-gray-700 dark:text-commonWhite-d`}
          >
            {label}
          </Listbox.Label>
          <div className={`relative ${className}`}>
            <Listbox.Button
              className={`${getBgColor(dropdownColor, dropdownVariant)} 
  relative w-full rounded-lg border py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm
  ${disabled ? "cursor-not-allowed opacity-50" : "cursor-default"}`}
            >
              <span className='block truncate font-medium w-full'>
                {selected?.name || "No Selection"}
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
                {data.map((group, index) => (
                  <GroupedSelectOption
                    key={index}
                    label={group.label}
                    options={group.options}
                    dropdownColor={dropdownColor}
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

export default GroupedAppSelect;
