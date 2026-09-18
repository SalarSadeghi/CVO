import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Alert,
  Box,
  Button,
  Grid,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { APP_CONFIG } from "../config/app.config";
import { CapturePreviewCard } from "../features/capture/components/CapturePreviewCard";
import { ImagePicker } from "../features/capture/components/ImagePicker";
import { useCaptureStore } from "../features/capture/capture.store";
import { useSaveCaptureBatch } from "../storage/library.queries";
import type { BatchState } from "../types/domain";

const rejectionMessages = {
  duplicate: "قبلاً انتخاب شده است",
  "unsupported-type": "فرمت پشتیبانی‌شده‌ای ندارد",
  "too-large": `بزرگ‌تر از ${(APP_CONFIG.maxImageSizeBytes / 1024 / 1024).toLocaleString("fa-IR")} مگابایت است`,
  "limit-reached": `از محدودیت ${APP_CONFIG.maxImagesPerRequest.toLocaleString("fa-IR")} تصویر عبور می‌کند`,
} as const;

export function CapturePage() {
  const navigate = useNavigate();
  const drafts = useCaptureStore((state) => state.drafts);
  const addFiles = useCaptureStore((state) => state.addFiles);
  const removeDraft = useCaptureStore((state) => state.removeDraft);
  const clearDrafts = useCaptureStore((state) => state.clearDrafts);
  const saveBatch = useSaveCaptureBatch();
  const [notice, setNotice] = useState<string | null>(null);

  const remainingSlots = APP_CONFIG.maxImagesPerRequest - drafts.length;
  const progress = (drafts.length / APP_CONFIG.maxImagesPerRequest) * 100;

  const handleFiles = (files: File[]) => {
    const result = addFiles(files);
    if (result.rejected.length) {
      const first = result.rejected[0];
      if (!first) return;
      const remaining = result.rejected.length - 1;
      setNotice(
        `فایل «${first.name}» ${rejectionMessages[first.reason]}${
          remaining
            ? `؛ ${remaining.toLocaleString("fa-IR")} فایل دیگر نیز پذیرفته نشد.`
            : "."
        }`,
      );
    }
  };

  const persist = async (state: BatchState) => {
    if (!drafts.length) return;
    await saveBatch.mutateAsync({ drafts, state });
    clearDrafts();
    navigate("/library", {
      state: {
        message:
          state === "ready"
            ? "تصاویر ذخیره شدند و برای ارسال در آینده آماده هستند."
            : "تصاویر روی این دستگاه ذخیره شدند.",
      },
    });
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="بازرسی جدید"
        title="ثبت مجموعه تصاویر"
        description="برای هر درخواست یک مجموعه تصویر واضح آماده کنید. پیش از ذخیره یا آماده‌سازی برای ارسال، همهٔ تصاویر را بررسی کنید."
      />

      <Alert
        icon={<CheckCircleRoundedIcon />}
        severity="info"
        variant="outlined"
      >
        در این نسخه هیچ اطلاعاتی به سرور ارسال نمی‌شود و تصاویر فقط در همین
        مرورگر و روی دستگاه شما می‌مانند.
      </Alert>

      <ImagePicker
        disabled={remainingSlots === 0 || saveBatch.isPending}
        onFilesSelected={handleFiles}
        remainingSlots={remainingSlots}
      />

      {drafts.length > 0 && (
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", mb: 0.75 }}
              >
                <Typography sx={{ fontWeight: 700 }} variant="body2">
                  {drafts.length.toLocaleString("fa-IR")} تصویر انتخاب شده
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {remainingSlots.toLocaleString("fa-IR")} جای خالی
                </Typography>
              </Stack>
              <LinearProgress
                sx={{ borderRadius: 4, height: 6 }}
                value={progress}
                variant="determinate"
              />
            </Box>
            <Button
              color="inherit"
              disabled={saveBatch.isPending}
              onClick={clearDrafts}
            >
              حذف همه
            </Button>
          </Stack>

          <Grid container spacing={2}>
            {drafts.map((image, index) => (
              <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CapturePreviewCard
                  image={image}
                  index={index}
                  onRemove={removeDraft}
                />
              </Grid>
            ))}
          </Grid>

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            useFlexGap
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              disabled={saveBatch.isPending}
              onClick={() => void persist("saved")}
              startIcon={<SaveOutlinedIcon />}
              variant="outlined"
            >
              <Typography sx={{ paddingX: "8px" }}>
                {" "}
                ذخیره روی دستگاه
              </Typography>
            </Button>
            <Button
              disabled={saveBatch.isPending}
              onClick={() => void persist("ready")}
              startIcon={<SendRoundedIcon />}
              variant="contained"
            >
              <Typography sx={{ paddingX: "8px" }}>
                {saveBatch.isPending ? "در حال ذخیره…" : "ذخیره و آماده‌سازی"}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      )}

      {saveBatch.isError && (
        <Alert severity="error">
          ذخیره تصاویر ممکن نشد. فضای ذخیره‌سازی دستگاه را بررسی و دوباره تلاش
          کنید.
        </Alert>
      )}

      <Snackbar
        autoHideDuration={5000}
        message={notice}
        onClose={() => setNotice(null)}
        open={Boolean(notice)}
      />
    </Stack>
  );
}
