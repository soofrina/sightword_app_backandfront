import "!style-loader!css-loader!postcss-loader!../src/index.css";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useDarkMode } from "storybook-dark-mode";
import { themes } from "@storybook/theming";

import { lightTheme, darkTheme } from "./themes";

export const decorators = [
  (Story, context) => {
    const { theme } = context.parameters;
    const storyTheme = useDarkMode() ? darkTheme : lightTheme;
    return (
      <ThemeProvider theme={storyTheme}>
        <Story />
      </ThemeProvider>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    current: "light",
    // Override the default dark theme
    dark: { ...themes.dark },
    // Override the default light theme
    light: { ...themes.normal },
  },
};
