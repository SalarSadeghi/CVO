import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import type { DraftImage } from "../../../types/domain";
import { formatBytes } from "../../../utils/format";

interface CapturePreviewCardProps {
  image: DraftImage;
  index: number;
  onRemove: (id: string) => void;
}

export function CapturePreviewCard({ image, index, onRemove }: CapturePreviewCardProps) {
  return (
    <Card sx={{ height: "100%", overflow: "hidden", position: "relative" }}>
      <Box
        alt={`تصویر انتخاب‌شده شماره ${index + 1}: ${image.file.name}`}
        component="img"
        src={image.previewUrl}
        sx={{ aspectRatio: "4 / 3", display: "block", objectFit: "cover", width: "100%" }}
      />
      <IconButton
        aria-label={`حذف ${image.file.name}`}
        onClick={() => onRemove(image.id)}
        size="small"
        sx={{
          backdropFilter: "blur(8px)",
          bgcolor: "rgba(9, 14, 12, 0.78)",
          color: "common.white",
          position: "absolute",
          right: 8,
          top: 8,
          "&:hover": { bgcolor: "error.main" },
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
          <Typography noWrap title={image.file.name} variant="body2">
            {image.file.name}
          </Typography>
          <Typography color="text.secondary" sx={{ flexShrink: 0 }} variant="caption">
            {formatBytes(image.file.size)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
