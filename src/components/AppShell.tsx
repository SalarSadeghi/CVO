import { useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddAPhotoRounded from "@mui/icons-material/AddAPhotoRounded";
import AnalyticsRounded from "@mui/icons-material/AnalyticsRounded";
import PhotoLibraryRounded from "@mui/icons-material/PhotoLibraryRounded";
import QrCodeScannerRounded from "@mui/icons-material/QrCodeScannerRounded";

import { useLocalLibrary } from "../storage/library.queries";

const navigation = [
  { label: "ثبت تصاویر", path: "/", icon: AddAPhotoRounded },
  { label: "تصاویر ذخیره‌شده", path: "/library", icon: PhotoLibraryRounded },
  { label: "نتایج", path: "/results", icon: AnalyticsRounded },
] as const;

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data } = useLocalLibrary();
  const savedCount = data?.images.length ?? 0;
  const activePath = useMemo(
    () =>
      navigation.find(
        (item) => item.path !== "/" && location.pathname.startsWith(item.path),
      )?.path ?? "/",
    [location.pathname],
  );

  return (
    <Box sx={{ minHeight: "100vh", pb: mobile ? 10 : 0 }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(18px)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 72,
            px: { xs: 2, md: 5 },
          }}
        >
          <Stack
            component={Link}
            to="/"
            direction="row"
            color="inherit"
            sx={{ alignItems: "center", gap: 1.25, textDecoration: "none" }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                bgcolor: "rgba(201,242,75,.1)",
                border: "1px solid rgba(201,242,75,.3)",
                borderRadius: 1.25,
              }}
            >
              <QrCodeScannerRounded />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                کویل‌ویژن
              </Typography>
              <Typography variant="caption" color="text.secondary">
                سامانه ثبت تصاویر
              </Typography>
            </Box>
          </Stack>

          {!mobile && (
            <Stack
              component="nav"
              direction="row"
              aria-label="ناوبری اصلی"
              sx={{ gap: 0.75 }}
            >
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = activePath === item.path;
                const icon =
                  item.path === "/library" ? (
                    <Badge badgeContent={savedCount} color="primary">
                      <Icon fontSize="small" />
                    </Badge>
                  ) : (
                    <Icon fontSize="small" />
                  );
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color={active ? "primary" : "inherit"}
                    variant={active ? "contained" : "text"}
                    startIcon={icon}
                  >
                    <Typography sx={{paddingX: "8px"}}> {item.label}</Typography>
                  </Button>
                );
              })}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Outlet />
      </Container>

      {mobile && (
        <BottomNavigation
          component="nav"
          aria-label="ناوبری اصلی"
          value={activePath}
          onChange={(_, value: string) => navigate(value)}
          showLabels
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.appBar,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <BottomNavigationAction
                key={item.path}
                value={item.path}
                label={item.label}
                icon={<Icon />}
              />
            );
          })}
        </BottomNavigation>
      )}
    </Box>
  );
}
