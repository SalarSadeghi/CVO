import { alpha, createTheme } from "@mui/material/styles";
import { faIR } from "@mui/material/locale";

const assetBase = import.meta.env.BASE_URL;

export const appTheme = createTheme(
  {
    cssVariables: true,
    direction: "rtl",
    palette: {
      mode: "dark",
      primary: { main: "#C9F24B", contrastText: "#172000" },
      secondary: { main: "#76D7C4" },
      background: { default: "#080C0B", paper: "#111816" },
      text: { primary: "#F2F6F3", secondary: "#9AAAA4" },
      divider: "#293632",
      error: { main: "#FF8B7B" },
      warning: { main: "#F3C467" },
      success: { main: "#78D69A" },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "IRANSans, Tahoma, ui-sans-serif, system-ui, sans-serif",
      h1: {
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 760,
        lineHeight: 1,
        letterSpacing: 0,
      },
      h2: { fontSize: "1.35rem", fontWeight: 720, letterSpacing: 0 },
      button: { fontWeight: 700, textTransform: "none" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "@font-face": [
            {
              fontDisplay: "swap",
              fontFamily: "IRANSans",
              fontStyle: "normal",
              fontWeight: 300,
              src: `url("${assetBase}fonts/IRANSans-Light.ttf") format("truetype")`,
            },
            {
              fontDisplay: "swap",
              fontFamily: "IRANSans",
              fontStyle: "normal",
              fontWeight: 400,
              src: `url("${assetBase}fonts/IRANSans-Regular.ttf") format("truetype")`,
            },
            {
              fontDisplay: "swap",
              fontFamily: "IRANSans",
              fontStyle: "normal",
              fontWeight: 500,
              src: `url("${assetBase}fonts/IRANSans-Medium.ttf") format("truetype")`,
            },
            {
              fontDisplay: "swap",
              fontFamily: "IRANSans",
              fontStyle: "normal",
              fontWeight: 700,
              src: `url("${assetBase}fonts/IRANSans-Bold.ttf") format("truetype")`,
            },
          ],
          html: { direction: "rtl" },
          body: {
            direction: "rtl",
            minWidth: 320,
            minHeight: "100vh",
            backgroundImage: `radial-gradient(circle at 8% -15%, ${alpha("#C9F24B", 0.09)}, transparent 32rem)`,
          },
          "*": { boxSizing: "border-box" },
          "::selection": { color: "#172000", backgroundColor: "#C9F24B" },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { minHeight: 44, borderRadius: 9 } },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage:
              "linear-gradient(145deg, rgba(21,30,28,.98), rgba(14,21,19,.98))",
            border: "1px solid #293632",
            boxShadow: "0 24px 70px rgba(0,0,0,.24)",
          },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
    },
  },
  faIR,
);
