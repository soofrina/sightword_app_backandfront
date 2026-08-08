import { ButtonVariant, ButtonColor } from "@base/type/appButton";

export const customButtonStyle = (
  variant: ButtonVariant,
  color: ButtonColor,
): string => {
  const isSolidButton = variant === ButtonVariant.SOLID;
  const isOutlineButton = variant === ButtonVariant.OUTLINED;
  const isGhostButton = variant === ButtonVariant.GHOST;

  const isPrimaryColor = color === ButtonColor.PRIMARY;
  const isSecondaryColor = color === ButtonColor.SECONDARY;

  if (isSolidButton) {
    if (isSecondaryColor) {
      return "hover:bg-secondaryDark text-white";
    }
  }

  if (isOutlineButton) {
    if (isPrimaryColor) {
      return "hover:bg-primaryDark hover:text-primaryContrastText hover:border-primaryDark";
    }
    if (isSecondaryColor) {
      return "border-secondaryDark text-secondaryContrastText hover:bg-secondaryLight";
    }
  }

  if (isGhostButton) {
    if (isPrimaryColor) {
      return "hover:bg-primaryLight";
    } else if (isSecondaryColor) {
      return "text-secondaryContrastText hover:bg-secondaryLight";
    }
  }

  return "";
};
