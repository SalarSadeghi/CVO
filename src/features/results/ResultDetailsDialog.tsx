import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ImageStatusChip } from "../../components/ImageStatusChip";
import { useObjectUrl } from "../../hooks/useObjectUrl";
import type { StoredImage } from "../../types/domain";
import { formatConfidence, formatDateTime } from "../../utils/format";

interface ResultDetailsDialogProps {
  image: StoredImage | null;
  onClose: () => void;
}

export function ResultDetailsDialog({
  image,
  onClose,
}: ResultDetailsDialogProps) {
  const source = useObjectUrl(image?.blob);
  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={Boolean(image)}>
      {image && (
        <>
          <DialogTitle>نتیجه تصویر</DialogTitle>
          <DialogContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <Box
                alt={image.name}
                component="img"
                src={source ?? undefined}
                sx={{
                  bgcolor: "background.default",
                  borderRadius: 2,
                  maxHeight: 420,
                  objectFit: "contain",
                  width: { xs: "100%", md: "52%" },
                }}
              />
              <Stack
                divider={<Divider flexItem />}
                spacing={1.75}
                sx={{ flex: 1 }}
              >
                <ResultField label="نام فایل" value={image.name} />
                <Stack spacing={0.75}>
                  <Typography color="text.secondary" variant="caption">
                    وضعیت
                  </Typography>
                  <Box>
                    <ImageStatusChip status={image.analysis.status} />
                  </Box>
                </Stack>
                <ResultField
                  label="مقدار شناسایی‌شده"
                  value={image.analysis.detectedValue ?? "—"}
                />
                <ResultField
                  label="میزان اطمینان"
                  value={formatConfidence(image.analysis.confidence)}
                />
                <ResultField
                  label="زمان ذخیره"
                  value={formatDateTime(image.createdAt)}
                />
                <ResultField
                  label="زمان پردازش"
                  value={
                    image.analysis.processedAt
                      ? formatDateTime(image.analysis.processedAt)
                      : "پردازش نشده"
                  }
                />
                {image.analysis.message && (
                  <ResultField label="پیام" value={image.analysis.message} />
                )}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>بستن</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

function ResultField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
    </Stack>
  );
}
