import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { StoredImageCard } from "../../components/StoredImageCard";
import type { CaptureBatch, StoredImage } from "../../types/domain";
import { formatDateTime } from "../../utils/format";

interface BatchCardProps {
  batch: CaptureBatch;
  images: StoredImage[];
  onDeleteBatch: (batch: CaptureBatch) => void;
  onDeleteImage: (image: StoredImage) => void;
}

export function BatchCard({
  batch,
  images,
  onDeleteBatch,
  onDeleteImage,
}: BatchCardProps) {
  return (
    <Paper
      component="section"
      sx={{ overflow: "hidden", p: { xs: 2, md: 2.5 } }}
      variant="outlined"
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Stack
            useFlexGap
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          >
            <Typography component="h2" variant="h6" sx={{ fontWeight: 750 }}>
              {formatDateTime(batch.createdAt)}
            </Typography>
            <Chip
              color={batch.state === "ready" ? "primary" : "default"}
              label={
                <Typography sx={{}}>
                  {batch.state === "ready" ? "آماده ارسال" : "ذخیره‌شده"}
                </Typography>
              }
              size="small"
              variant="outlined"
            />
          </Stack>
          <Typography color="text.secondary" variant="body2">
            {images.length.toLocaleString("fa-IR")} تصویر · شناسه مجموعه{" "}
            {batch.id.slice(-8)}
          </Typography>
        </Box>
        <Button
          color="error"
          onClick={() => onDeleteBatch(batch)}
          startIcon={<DeleteOutlineRoundedIcon />}
          size="small"
        >
          حذف مجموعه
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <StoredImageCard image={image} onDelete={onDeleteImage} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
