import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, ButtonBase, IconButton } from "@mui/material";
import type { DraftImage } from "../../../types/domain";

interface CapturePreviewCardProps {
  image: DraftImage;
  index: number;
  disabled?: boolean;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CapturePreviewCard({ image, index, disabled, onOpen, onRemove }: CapturePreviewCardProps) {
  return (
    <Box sx={{ position: "relative", flexShrink: 0, width: 88, height: 72 }}>
      <ButtonBase
        aria-label={`نمایش تصویر اصلی شماره ${(index + 1).toLocaleString("fa-IR")}: ${image.file.name}`}
        onClick={() => onOpen(image.id)}
        sx={{ width: "100%", height: "100%", borderRadius: 1.5, overflow: "hidden", "&.Mui-focusVisible": { outline: "3px solid", outlineColor: "primary.main", outlineOffset: 2 } }}
      >
        <Box component="img" alt={image.file.name} src={image.previewUrl}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </ButtonBase>
      <IconButton aria-label={`حذف ${image.file.name}`} disabled={disabled}
        onClick={() => onRemove(image.id)} size="small"
        sx={{ position: "absolute", right: 0, top: 0, bgcolor: "rgba(9,14,12,.85)", color: "common.white", "&:hover": { bgcolor: "error.main" } }}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
