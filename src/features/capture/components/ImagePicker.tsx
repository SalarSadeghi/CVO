import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { APP_CONFIG } from "../../../config/app.config";
import { CameraCaptureDialog } from "./CameraCaptureDialog";

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
    if (!files?.length) return;
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
        minHeight: 220,
        p: { xs: 3, sm: 4 },
        textAlign: "center",
        transition: "background-color 160ms ease, border-color 160ms ease",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "primary.main",
          borderRadius: 2.5,
          color: "primary.contrastText",
          display: "flex",
          height: 54,
          justifyContent: "center",
          width: 54,
        }}
      >
        <PhotoCameraRoundedIcon />
      </Box>

      <Box>
        <Typography variant="h6">افزودن عکس</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
          با دوربین عکس بگیرید، چند تصویر را از دستگاه انتخاب کنید یا فایل‌ها را
          اینجا بکشید. {remainingSlots.toLocaleString("fa-IR")} از{" "}
          {APP_CONFIG.maxImagesPerRequest.toLocaleString("fa-IR")} جای خالی باقی
          مانده است.
        </Typography>
      </Box>

      <Stack
        sx={{}}
        direction={{ xs: "column", sm: "row" }}
        useFlexGap
        spacing={1.25}
      >
        <Button
          disabled={disabled}
          onClick={() => setCameraOpen(true)}
          startIcon={<PhotoCameraRoundedIcon />}
          variant="contained"
        >
          <Typography sx={{ paddingX: "8px" }}> گرفتن عکس</Typography>
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

      <Typography color="text.secondary" variant="caption">
        JPEG، PNG یا WebP · حداکثر{" "}
        {(APP_CONFIG.maxImageSizeBytes / 1024 / 1024).toLocaleString("fa-IR")}{" "}
        مگابایت برای هر تصویر
      </Typography>

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
      <CameraCaptureDialog
        onCapture={(file) => onFilesSelected([file])}
        onClose={() => setCameraOpen(false)}
        open={cameraOpen}
        remainingSlots={remainingSlots}
      />
    </Box>
  );
}
