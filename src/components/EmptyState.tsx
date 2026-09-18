import type { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack
      sx={{ alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 300, px: 3, py: 6, border: "1px dashed", borderColor: "divider", borderRadius: 2 }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          display: "grid",
          placeItems: "center",
          color: "primary.main",
          bgcolor: "rgba(201,242,75,.1)",
          borderRadius: "50%",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 750 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 430, mt: 0.75, mb: action ? 2.5 : 0 }}>
        {description}
      </Typography>
      {action}
    </Stack>
  );
}
