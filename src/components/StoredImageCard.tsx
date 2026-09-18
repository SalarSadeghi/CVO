import { Card, CardActions, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import OpenInFullRounded from "@mui/icons-material/OpenInFullRounded";

import { useObjectUrl } from "../hooks/useObjectUrl";
import type { StoredImage } from "../types/domain";
import { formatBytes } from "../utils/format";
import { ImageStatusChip } from "./ImageStatusChip";

interface StoredImageCardProps {
  image: StoredImage;
  onDelete?: (image: StoredImage) => void;
  onOpen?: (image: StoredImage) => void;
}

export function StoredImageCard({ image, onDelete, onOpen }: StoredImageCardProps) {
  const source = useObjectUrl(image.blob);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "none" }}>
      <CardMedia
        component="img"
        src={source ?? undefined}
        alt={image.name}
        sx={{ height: 180, objectFit: "cover", bgcolor: "#060908", cursor: onOpen ? "pointer" : "default" }}
        onClick={() => onOpen?.(image)}
      />
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, alignItems: "flex-start" }}>
          <Typography noWrap title={image.name} sx={{ fontWeight: 700 }}>{image.name}</Typography>
          <ImageStatusChip status={image.analysis.status} />
        </Stack>
        <Typography variant="caption" color="text.secondary">{formatBytes(image.size)}</Typography>
      </CardContent>
      {(onDelete || onOpen) && (
        <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
          {onOpen && (
            <Tooltip title="نمایش جزئیات">
              <IconButton size="small" onClick={() => onOpen(image)}><OpenInFullRounded fontSize="small" /></IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="حذف تصویر">
              <IconButton size="small" color="error" onClick={() => onDelete(image)}>
                <DeleteOutlineRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
}
