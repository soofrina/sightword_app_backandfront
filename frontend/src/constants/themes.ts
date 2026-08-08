/* eslint-disable @typescript-eslint/no-empty-interface */
import { theme } from "@base/tailwind.config";
import { PaletteOptions } from "@mui/material";

/**
 * Add custom colour interfaces here.
 */
export interface Overlay {
  main: string;
  secondary: string;
}

export interface CustomText {
  header: string;
  title: string;
  body: string;
  subHeader: string;
  subLine: string;
  selectedButton: string;
  button: string;
}

interface MyPaletteExtensions {
  overlay: Overlay;
  customText: CustomText;
}

declare module "@mui/material/styles" {
  interface Palette extends MyPaletteExtensions {}
  interface PaletteOptions extends MyPaletteExtensions {}
}

/**
 * DO NOT AMEND from here onwards.
 */
const { colors } = theme.extend;

export const palleteDark: PaletteOptions = {
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
  overlay: {
    main: colors["overlayMain-d"],
    secondary: colors["overlaySecondary-d"],
  },
  customText: {
    header: colors["header-d"],
    title: colors["title-d"],
    body: colors["body-d"],
    subHeader: colors["subHeader-d"],
    subLine: colors["subLine-d"],
    selectedButton: colors["selectedButton-d"],
    button: colors["button-d"],
  },
};

export const palleteLight: PaletteOptions = {
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
  overlay: {
    main: colors.overlayMain,
    secondary: colors.overlaySecondary,
  },
  customText: {
    header: colors.header,
    title: colors.title,
    body: colors.body,
    subHeader: colors.subHeader,
    subLine: colors.subLine,
    selectedButton: colors.selectedButton,
    button: colors.button,
  },
};
