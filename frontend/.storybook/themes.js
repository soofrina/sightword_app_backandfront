import { createTheme } from "@mui/material/styles";

import { theme } from "../src/tailwind.config";
const { colors } = theme.extend;

const lightPallete = {
  mode: "light",
  common: {
    black: colors.commonBlack,
    white: colors.commonWhite,
  },
  primary: {
    light: colors.primaryLight,
    main: colors.primaryMain,
    dark: colors.primaryDark,
    contrastText: colors.primaryContrastText,
  },
  secondary: {
    light: colors.secondaryLight,
    main: colors.secondaryMain,
    dark: colors.secondaryDark,
    contrastText: colors.secondaryContrastText,
  },
  success: {
    light: colors.successLight,
    main: colors.successMain,
    dark: colors.successDark,
    contrastText: colors.successContrastText,
  },
  error: {
    light: colors.errorLight,
    main: colors.errorMain,
    dark: colors.errorDark,
    contrastText: colors.errorContrastText,
  },
  warning: {
    light: colors.warningLight,
    main: colors.warningMain,
    dark: colors.warningDark,
    contrastText: colors.warningContrastText,
  },
  info: {
    light: colors.infoLight,
    main: colors.infoMain,
    dark: colors.infoDark,
    contrastText: colors.infoContrastText,
  },
  text: {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    disabled: colors.textDisabled,
  },
  background: {
    paper: colors.backgroundPaper,
    default: colors.backgroundDefault,
  },
};

const darkPallete = {
  mode: "dark",
  common: {
    black: colors["commonBlack-d"],
    white: colors["commonWhite-d"],
  },
  primary: {
    light: colors["primaryLight-d"],
    main: colors["primaryMain-d"],
    dark: colors["primaryDark-d"],
    contrastText: colors["primaryContrastText-d"],
  },
  secondary: {
    light: colors["secondaryLight-d"],
    main: colors["secondaryMain-d"],
    dark: colors["secondaryDark-d"],
    contrastText: colors["secondaryContrastText-d"],
  },
  success: {
    light: colors["successLight-d"],
    main: colors["successMain-d"],
    dark: colors["successDark-d"],
    contrastText: colors["successContrastText-d"],
  },
  error: {
    light: colors["errorLight-d"],
    main: colors["errorMain-d"],
    dark: colors["errorDark-d"],
    contrastText: colors["errorContrastText-d"],
  },
  warning: {
    light: colors["warningLight-d"],
    main: colors["warningMain-d"],
    dark: colors["warningDark-d"],
    contrastText: colors["warningContrastText-d"],
  },
  info: {
    light: colors["infoLight-d"],
    main: colors["infoMain-d"],
    dark: colors["infoDark-d"],
    contrastText: colors["infoContrastText-d"],
  },
  text: {
    primary: colors["textPrimary-d"],
    secondary: colors["textSecondary-d"],
    disabled: colors["textDisabled-d"],
  },
  background: {
    paper: colors["backgroundPaper-d"],
    default: colors["backgroundDefault-d"],
  },
};

export const lightTheme = createTheme({
  palette: lightPallete,
});

export const darkTheme = createTheme({
  palette: darkPallete,
});
