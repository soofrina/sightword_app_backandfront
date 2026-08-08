import { DropdownColor, DropdownVariant } from "@base/type/appDropdown";

export const getBgColor = (
  dropdownColor: DropdownColor,
  dropdownVariant: DropdownVariant,
): string => {
  if (
    dropdownColor === DropdownColor.PRIMARY &&
    dropdownVariant === DropdownVariant.SOLID
  ) {
    return "bg-primaryMain text-primaryContrastText";
  } else if (
    dropdownColor === DropdownColor.SECONDARY &&
    dropdownVariant === DropdownVariant.SOLID
  ) {
    return "bg-secondaryDark text-white";
  } else if (
    dropdownColor === DropdownColor.PRIMARY &&
    dropdownVariant === DropdownVariant.GHOST
  ) {
    return "bg-white text-primaryMain border border-primaryMain";
  } else if (
    dropdownColor === DropdownColor.SECONDARY &&
    dropdownVariant === DropdownVariant.GHOST
  ) {
    return "bg-white text-secondaryContrastText border border-secondaryDark";
  }
  return "";
};

export const getTextColor = (dropdownColor: DropdownColor): string => {
  if (dropdownColor === DropdownColor.PRIMARY) {
    return "text-primaryMain";
  } else if (dropdownColor === DropdownColor.SECONDARY) {
    return "text-secondaryContrastText";
  }
  return "";
};

export const getFullBorderColor = (dropdownColor: DropdownColor): string => {
  if (dropdownColor === DropdownColor.PRIMARY) {
    return "border-primaryMain";
  } else if (dropdownColor === DropdownColor.SECONDARY) {
    return "border-secondaryMain";
  }
  return "";
};

export const getBottomBorderColor = (dropdownColor: DropdownColor): string => {
  if (dropdownColor === DropdownColor.PRIMARY) {
    return "border-b-primaryMain";
  } else if (dropdownColor === DropdownColor.SECONDARY) {
    return "border-b-secondaryMain";
  }
  return "";
};

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};
