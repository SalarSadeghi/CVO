import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { APP_CONFIG } from "../../../config/app.config";
import { CameraCapture } from "./CameraCapture";

interface ImagePickerProps {
  disabled?: boolean;
  remainingSlots: number;
  onFilesSelected: (files: File[]) => void;
}

export function ImagePicker({
  disabled = false,
  remainingSlots,
  onFilesSelected,
}: ImagePickerProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const accept = APP_CONFIG.acceptedImageTypes.join(",");

  const forwardFiles = (files: FileList | null) => {
    if (disabled || !files?.length) return;
    onFilesSelected(Array.from(files));
  };

  return (
    <Box
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled) forwardFiles(event.dataTransfer.files);
      }}
      sx={{
        alignItems: "center",
        bgcolor: isDragging ? "action.hover" : "background.paper",
        border: "1px dashed",
        borderColor: isDragging ? "primary.main" : "divider",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        minHeight: 0,
        p: { xs: 1.5, sm: 2 },
        textAlign: "center",
        transition: "background-color 160ms ease, border-color 160ms ease",
      }}
    >
      {!cameraOpen && (
        <Box>
          <Typography variant="h6">افزودن عکس</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            با دوربین عکس بگیرید، چند تصویر را از دستگاه انتخاب کنید یا فایل‌ها
            را اینجا بکشید. {remainingSlots.toLocaleString("fa-IR")} از{" "}
            {APP_CONFIG.maxImagesPerRequest.toLocaleString("fa-IR")} جای خالی
            باقی مانده است.
          </Typography>
        </Box>
      )}

      <Stack
        sx={{ flexWrap: "wrap", justifyContent: "center" }}
        direction="row"
        useFlexGap
        spacing={1.25}
      >
        <Button
          disabled={disabled && !cameraOpen}
          onClick={() => setCameraOpen((value) => !value)}
          startIcon={<PhotoCameraRoundedIcon />}
          variant="contained"
        >
          <Typography sx={{ paddingX: "8px" }}>
            {" "}
            {cameraOpen ? "خاموش کردن دوربین" : "روشن کردن دوربین"}
          </Typography>
        </Button>
        <Button
          disabled={disabled}
          onClick={() => galleryInputRef.current?.click()}
          startIcon={<AddPhotoAlternateRoundedIcon />}
          variant="outlined"
        >
          <Typography sx={{ paddingX: "8px" }}> انتخاب از دستگاه</Typography>
        </Button>
      </Stack>

      {!cameraOpen && (
        <Typography color="text.secondary" variant="caption">
          JPEG، PNG یا WebP · حداکثر{" "}
          {(APP_CONFIG.maxImageSizeBytes / 1024 / 1024).toLocaleString("fa-IR")}{" "}
          مگابایت برای هر تصویر
        </Typography>
      )}

      <input
        ref={galleryInputRef}
        accept={accept}
        hidden
        multiple
        onChange={(event) => {
          forwardFiles(event.target.files);
          event.target.value = "";
        }}
        type="file"
      />
      {cameraOpen && (
        <Box sx={{ width: "100%" }}>
          <CameraCapture
            onCapture={(file) => onFilesSelected([file])}
            onClose={() => setCameraOpen(false)}
            disabled={disabled}
            remainingSlots={remainingSlots}
          />
        </Box>
      )}
    </Box>
  );
}
