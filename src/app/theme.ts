import { alpha, createTheme } from "@mui/material/styles";
import { faIR } from "@mui/material/locale";

const assetBase = import.meta.env.BASE_URL;

export const appTheme = createTheme({
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
    fontFamily: 'BYekan, Asap, Tahoma, ui-sans-serif, system-ui, sans-serif',
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
            fontFamily: "BYekan",
            fontStyle: "normal",
            fontWeight: 400,
            src: `url("${assetBase}fonts/BYekan.ttf") format("truetype")`,
          },
          {
            fontDisplay: "swap",
            fontFamily: "BYekan",
            fontStyle: "normal",
            fontWeight: 700,
            src: `url("${assetBase}fonts/BYekanBold.ttf") format("truetype")`,
          },
          {
            fontDisplay: "swap",
            fontFamily: "Asap",
            fontStyle: "normal",
            fontWeight: "100 900",
            src: `url("${assetBase}fonts/Asap-Variable.ttf") format("truetype")`,
          },
          {
            fontDisplay: "swap",
            fontFamily: "Asap",
            fontStyle: "italic",
            fontWeight: "100 900",
            src: `url("${assetBase}fonts/Asap-Italic-Variable.ttf") format("truetype")`,
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
          backgroundImage: "linear-gradient(145deg, rgba(21,30,28,.98), rgba(14,21,19,.98))",
          border: "1px solid #293632",
          boxShadow: "0 24px 70px rgba(0,0,0,.24)",
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
  },
}, faIR);
