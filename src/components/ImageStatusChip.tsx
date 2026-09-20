import { Chip } from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ErrorRounded from "@mui/icons-material/ErrorRounded";
import HelpRounded from "@mui/icons-material/HelpRounded";
import HourglassTopRounded from "@mui/icons-material/HourglassTopRounded";
import RemoveCircleRounded from "@mui/icons-material/RemoveCircleRounded";

import type { ImageProcessingStatus } from "../types/domain";

const statusPresentation: Record<
  ImageProcessingStatus,
  {
    label: string;
    color: "default" | "success" | "warning" | "error";
    icon: typeof CheckCircleRounded;
  }
> = {
  pending: {
    label: "در انتظار پردازش",
    color: "default",
    icon: HourglassTopRounded,
  },
  detected: {
    label: "شناسایی‌شده",
    color: "success",
    icon: CheckCircleRounded,
  },
  "not-detected": {
    label: "شناسایی‌نشده",
    color: "warning",
    icon: RemoveCircleRounded,
  },
  "bad-detection": {
    label: "شناسایی نامعتبر",
    color: "warning",
    icon: HelpRounded,
  },
  failed: { label: "ناموفق", color: "error", icon: ErrorRounded },
};

interface ImageStatusChipProps {
  status: ImageProcessingStatus;
  size?: "small" | "medium";
}

export function ImageStatusChip({
  status,
  size = "small",
}: ImageStatusChipProps) {
  const presentation = statusPresentation[status];
  const Icon = presentation.icon;
  return (
    <Chip
      size={size}
      color={presentation.color}
      // icon={<Icon />}
      label={presentation.label}
      variant="outlined"
    />
  );
}
