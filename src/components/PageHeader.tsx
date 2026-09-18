import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 3, mb: 4 }}
    >
      <Box sx={{ maxWidth: 700 }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: "0.16em" }}>
          {eyebrow}
        </Typography>
        <Typography component="h1" variant="h1" sx={{ mt: 0.5 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 620 }}>
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
