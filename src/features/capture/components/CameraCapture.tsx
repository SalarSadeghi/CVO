import CameraswitchRoundedIcon from "@mui/icons-material/CameraswitchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

type CameraStatus = "idle" | "requesting" | "ready" | "error";
type FacingMode = "environment" | "user";

interface CameraCaptureProps {
  disabled?: boolean;
  remainingSlots: number;
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraCapture({
  disabled = false,
  remainingSlots,
  onCapture,
  onClose,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [requestVersion, setRequestVersion] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    sessionRef.current += 1;
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
        if (!cancelled) setStatus("ready");
      } catch (cause) {
        if (cancelled) return;
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setError(getCameraErrorMessage(cause));
        setStatus("error");
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      sessionRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [facingMode, requestVersion]);

  const handleClose = () => {
    if (isCapturing) return;
    onClose();
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    if (
      disabled ||
      remainingSlots <= 0 ||
      isCapturing ||
      !video ||
      status !== "ready" ||
      !video.videoWidth ||
      !video.videoHeight
    )
      return;

    const session = sessionRef.current;
    setIsCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas-context");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(canvas);
      if (session !== sessionRef.current) return;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      onCapture(
        new File([blob], `coil-${timestamp}.jpg`, {
          type: blob.type,
          lastModified: Date.now(),
        }),
      );
    } catch {
      if (session !== sessionRef.current) return;
      setError("ثبت تصویر انجام نشد. لطفاً دوباره تلاش کنید.");
      setStatus("error");
    } finally {
      if (session === sessionRef.current) setIsCapturing(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      aria-label="دوربین ثبت تصویر"
      sx={{ overflow: "hidden" }}
    >
      <Box
        sx={{
          p: 1.5,
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
      </Box>

      <Box
        sx={{
          display: "grid",
          p: { xs: 1, sm: 2 },
          placeItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: "#020504",
            borderRadius: { xs: 0, sm: 2 },
            height: "clamp(180px, 36dvh, 420px)",
            overflow: "hidden",
            position: "relative",
            width: "100%",
          }}
        >
          <Box
            width={"1000px"}
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
      </Box>

      <Stack
        direction="row"
        sx={{ justifyContent: "center", p: 1.5, gap: 1, flexWrap: "wrap" }}
      >
        <Button
          aria-label="تغییر دوربین جلو و پشت"
          disabled={disabled || status !== "ready" || isCapturing}
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
          disabled={
            disabled || remainingSlots <= 0 || status !== "ready" || isCapturing
          }
          onClick={() => void captureFrame()}
          startIcon={<PhotoCameraRoundedIcon />}
          variant="contained"
        >
          <Typography sx={{ paddingX: "8px" }}>
            {" "}
            {isCapturing ? "در حال ثبت…" : "ثبت عکس"}
          </Typography>
        </Button>
      </Stack>
    </Paper>
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
