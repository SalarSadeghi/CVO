import { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";

const CapturePage = lazy(() =>
  import("../pages/CapturePage").then((module) => ({ default: module.CapturePage })),
);
const SavedImagesPage = lazy(() =>
  import("../pages/SavedImagesPage").then((module) => ({ default: module.SavedImagesPage })),
);
const ResultsPage = lazy(() =>
  import("../pages/ResultsPage").then((module) => ({ default: module.ResultsPage })),
);

export function AppRouter() {
  return (
    <HashRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route element={<CapturePage />} index />
            <Route element={<SavedImagesPage />} path="library" />
            <Route element={<ResultsPage />} path="results" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

function RouteLoading() {
  return (
    <Box sx={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
      <CircularProgress aria-label="در حال بارگذاری صفحه" />
    </Box>
  );
}
