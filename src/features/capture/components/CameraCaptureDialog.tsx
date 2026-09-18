import CameraswitchRoundedIcon from "@mui/icons-material/CameraswitchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

type CameraStatus = "idle" | "requesting" | "ready" | "error";
type FacingMode = "environment" | "user";

interface CameraCaptureDialogProps {
  open: boolean;
  remainingSlots: number;
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraCaptureDialog({
  open,
  remainingSlots,
  onCapture,
  onClose,
}: CameraCaptureDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [requestVersion, setRequestVersion] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setStatus("requesting");
    setError(null);

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("مرورگر شما امکان دسترسی مستقیم به دوربین را ندارد.");
        setStatus("error");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            height: { ideal: 1080 },
            width: { ideal: 1920 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("ready");
      } catch (cause) {
        if (cancelled) return;
        setError(getCameraErrorMessage(cause));
        setStatus("error");
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [facingMode, open, requestVersion]);

  const handleClose = () => {
    if (isCapturing) return;
    onClose();
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    if (!video || status !== "ready" || !video.videoWidth || !video.videoHeight)
      return;

    setIsCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas-context");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(canvas);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      onCapture(
        new File([blob], `coil-${timestamp}.jpg`, {
          type: blob.type,
          lastModified: Date.now(),
        }),
      );
      onClose();
    } catch {
      setError("ثبت تصویر انجام نشد. لطفاً دوباره تلاش کنید.");
      setStatus("error");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Dialog
      aria-labelledby="camera-dialog-title"
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle
        id="camera-dialog-title"
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography component="span" variant="h6">
            گرفتن عکس
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ display: "block" }}
            variant="caption"
          >
            {remainingSlots.toLocaleString("fa-IR")} جای خالی در این مجموعه
          </Typography>
        </Box>
        <IconButton
          aria-label="بستن دوربین"
          disabled={isCapturing}
          edge="end"
          onClick={handleClose}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "grid",
          minHeight: { xs: 360, sm: 500 },
          p: { xs: 1, sm: 2 },
          placeItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#020504",
            borderRadius: { xs: 0, sm: 2 },
            height: "100%",
            minHeight: { xs: 340, sm: 460 },
            overflow: "hidden",
            position: "relative",
            width: "100%",
          }}
        >
          <Box
            autoPlay
            component="video"
            muted
            playsInline
            ref={videoRef}
            sx={{
              display: "block",
              height: "100%",
              objectFit: "contain",
              position: "absolute",
              width: "100%",
            }}
          />

          {status === "requesting" && (
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                inset: 0,
                justifyContent: "center",
                position: "absolute",
              }}
            >
              <CircularProgress />
              <Typography>در حال آماده‌سازی دوربین…</Typography>
            </Stack>
          )}

          {status === "error" && (
            <Stack
              spacing={2}
              sx={{
                inset: 0,
                justifyContent: "center",
                p: 3,
                position: "absolute",
              }}
            >
              <Alert severity="error">{error}</Alert>
              <Button
                onClick={() => setRequestVersion((value) => value + 1)}
                startIcon={<ReplayRoundedIcon />}
                variant="outlined"
              >
                تلاش دوباره
              </Button>
            </Stack>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2, gap: 4 }}>
        <Button
          aria-label="تغییر دوربین جلو و پشت"
          disabled={status !== "ready" || isCapturing}
          onClick={() =>
            setFacingMode((value) =>
              value === "environment" ? "user" : "environment",
            )
          }
          startIcon={<CameraswitchRoundedIcon />}
          variant="outlined"
        >
          <Typography sx={{ paddingX: "8px" }}> تغییر دوربین</Typography>
        </Button>
        <Button
          disabled={status !== "ready" || isCapturing}
          onClick={() => void captureFrame()}
          startIcon={<PhotoCameraRoundedIcon />}
          variant="contained"
        >
          <Typography sx={{ paddingX: "8px" }}>
            {" "}
            {isCapturing ? "در حال ثبت…" : "ثبت عکس"}
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("image-encoding-failed")),
      "image/jpeg",
      0.92,
    );
  });
}

function getCameraErrorMessage(cause: unknown): string {
  if (!(cause instanceof DOMException)) {
    return "دوربین در دسترس نیست. لطفاً اتصال دوربین را بررسی کنید.";
  }
  if (cause.name === "NotAllowedError" || cause.name === "SecurityError") {
    return "اجازهٔ دسترسی به دوربین داده نشد. دسترسی دوربین را برای این سایت فعال کنید.";
  }
  if (cause.name === "NotFoundError" || cause.name === "OverconstrainedError") {
    return "هیچ دوربین قابل استفاده‌ای روی این دستگاه پیدا نشد.";
  }
  if (cause.name === "NotReadableError" || cause.name === "AbortError") {
    return "دوربین توسط برنامهٔ دیگری در حال استفاده است یا فعلاً قابل خواندن نیست.";
  }
  return "راه‌اندازی دوربین انجام نشد. لطفاً دوباره تلاش کنید.";
}
