const tailwindTheme = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  important: true,
  theme: {
    extend: {
      fontSize: {
        xxs: "10px",
      },
      colors: {
        // Common Light
        commonBlack: "#000",
        commonWhite: "#fff",
        // Primary Light
        primaryMain: "#f4a295",
        primaryLight: "#FFFBFA",
        primaryDark: "#F7F7F7",
        primaryMainHover: "#f4a29566",
        primaryContrastText: "#fff",
        // Secondary Light
        secondaryMain: "#FAF9F6",
        secondaryLight: "#b0b0b033",
        secondaryDark: "#b0b0b0",
        secondaryMainHover: "#D9D9D9",
        secondaryMainSelected: "#EFEFEF",
        secondaryContrastText: "#ABABAB",
        // Error Light
        errorMain: "#ff6d56",
        errorLight: "#ff9f83",
        errorDark: "#c63b2c",
        errorContrastText: "#fff",
        // Warning Light
        warningMain: "#FCF0B4",
        warningLight: "#ff9800",
        warningDark: "#e65100",
        warningContrastText: "#fff",
        // Info Light
        infoMain: "#18289C",
        infoLight: "#7F7DE3",
        infoDark: "#01579b",
        infoContrastText: "#fff",
        // Success Light
        successMain: "#01bf5b",
        successLight: "#5cf38a",
        successDark: "#008d2e",
        successContrastText: "#fff",
        // Text Light
        textPrimary: "#414042",
        textSecondary: "#817F83",
        textDisabled: "#ABABAB",
        // Background Light
        backgroundPaper: "#fff",
        backgroundDefault: "#F2F3F8",
        // Overlay Light
        overlayMain: "#FFFFFF",
        overlaySecondary: "#FFFFFF",
        // Custom Text Colours Light
        header: "#000000",
        title: "#414042",
        body: "#414042",
        subHeader: "#817F83",
        subLine: "#ABABAB",
        selectedButton: "#F4A295",
        button: "#FFFFFF",

        // Common Dark
        "commonBlack-d": "#000",
        "commonWhite-d": "#fff",
        // Primary Dark
        "primaryMain-d": "#90caf9",
        "primaryLight-d": "#2C2C2E",
        "primaryDark-d": "#414141",
        "primaryContrastText-d": "#000000de",
        // Secondary Dark
        "secondaryMain-d": "#ce93d8",
        "secondaryLight-d": "#F0ACA1",
        "secondaryDark-d": "#D78679",
        "secondaryContrastText-d": "#000000de",
        // Error Dark
        "errorMain-d": "#F89787",
        "errorLight-d": "#e57373",
        "errorDark-d": "#d32f2f",
        "errorContrastText-d": "#fff",
        // Warning Dark
        "warningMain-d": "#ffa726",
        "warningLight-d": "#ffb74d",
        "warningDark-d": "#f57c00",
        "warningContrastText-d": "#000000de",
        // Info Dark
        "infoMain-d": "#727CD6",
        "infoLight-d": "#7F7DE3",
        "infoDark-d": "#0288d1",
        "infoContrastText-d": "#000000de",
        // Success Dark
        "successMain-d": "#59D795",
        "successLight-d": "#81c784",
        "successDark-d": "#388e3c",
        "successContrastText-d": "#000000de",
        // Text Dark
        "textPrimary-d": "#FFFFFFDE",
        "textSecondary-d": "#817F83",
        "textDisabled-d": "#ABABAB",
        "textIcon-d": "#ffffff80",
        // Background Dark
        "backgroundPaper-d": "#282c34",
        "backgroundDefault-d": "#121212",
        // Overlay Dark
        "overlayMain-d": "#424242",
        "overlaySecondary-d": "#DFDFE1",
        // Custom Text Colours Dark
        "header-d": "#F1F1F1DE",
        "title-d": "#FFFFFFDE",
        "body-d": "#FFFFFFDE",
        "subHeader-d": "#CDCCCE",
        "subLine-d": "#ABABAB",
        "selectedButton-d": "#F0ACA1",
        "button-d": "#FFFFFF",
        // Custom
        headerText: "#414042",
        subHeaderText: "#817F83",
        sublineText: "#ABABAB",
        selected: "#F4A295",
        background: "#E5E5E5",
        wordItemBorder: "#DFDFE1",
        wordBankBg: "#f8f9fb",
      },
      fontFamily: {},
    },
  },
};

// eslint-disable-next-line no-undef
module.exports = tailwindTheme;
