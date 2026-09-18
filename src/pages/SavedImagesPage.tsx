import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { BatchCard } from "../features/library/BatchCard";
import {
  useClearLocalLibrary,
  useDeleteCaptureBatch,
  useDeleteStoredImage,
  useLocalLibrary,
} from "../storage/library.queries";
import type { CaptureBatch, StoredImage } from "../types/domain";

type DeleteTarget =
  | { kind: "image"; value: StoredImage }
  | { kind: "batch"; value: CaptureBatch }
  | { kind: "all" };

export function SavedImagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationMessage = (location.state as { message?: string } | null)
    ?.message;
  const library = useLocalLibrary();
  const deleteImage = useDeleteStoredImage();
  const deleteBatch = useDeleteCaptureBatch();
  const clearLibrary = useClearLocalLibrary();
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [noticeOpen, setNoticeOpen] = useState(Boolean(locationMessage));

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "image")
      await deleteImage.mutateAsync(deleteTarget.value.id);
    if (deleteTarget.kind === "batch")
      await deleteBatch.mutateAsync(deleteTarget.value.id);
    if (deleteTarget.kind === "all") await clearLibrary.mutateAsync();
    setDeleteTarget(null);
  };

  const busy =
    deleteImage.isPending || deleteBatch.isPending || clearLibrary.isPending;
  const description =
    deleteTarget?.kind === "all"
      ? "همهٔ مجموعه‌ها و تصاویر ذخیره‌شده از این مرورگر حذف می‌شوند. این کار قابل بازگشت نیست."
      : deleteTarget?.kind === "batch"
        ? "این مجموعه و تمام تصاویر آن از مرورگر حذف می‌شوند. این کار قابل بازگشت نیست."
        : "تصویر انتخاب‌شده از مرورگر حذف می‌شود. این کار قابل بازگشت نیست.";

  return (
    <Stack spacing={3}>
      <PageHeader
        action={
          <Stack direction="row" spacing={1}>
            {Boolean(library.data?.images.length) && (
              <Button
                color="error"
                onClick={() => setDeleteTarget({ kind: "all" })}
                startIcon={<DeleteSweepRoundedIcon />}
              >
                حذف همه
              </Button>
            )}
            <Button
              component={Link}
              startIcon={<AddAPhotoRoundedIcon />}
              to="/"
              variant="contained"
            >
              <Typography sx={{ paddingX: "4px" }}>مجموعه جدید</Typography>
            </Button>
          </Stack>
        }
        description="مجموعه تصاویر ذخیره‌شده در این مرورگر. با تازه‌سازی صفحه باقی می‌مانند، اما با دستگاه دیگری همگام نمی‌شوند."
        eyebrow="آرشیو محلی"
        title="تصاویر ذخیره‌شده"
      />

      {library.isPending && (
        <CircularProgress
          aria-label="در حال بارگذاری تصاویر ذخیره‌شده"
          sx={{ alignSelf: "center", my: 8 }}
        />
      )}
      {library.isError && (
        <Alert severity="error">باز کردن آرشیو تصاویر ممکن نشد.</Alert>
      )}

      {library.data?.batches.length === 0 && (
        <EmptyState
          action={
            <Button component={Link} to="/" variant="contained">
              ثبت تصاویر
            </Button>
          }
          description="با دوربین عکس بگیرید یا تصاویر دستگاه را انتخاب و ذخیره کنید. مجموعه‌های شما اینجا نمایش داده می‌شوند."
          icon={<PhotoLibraryRoundedIcon fontSize="large" />}
          title="هنوز تصویری ذخیره نشده است"
        />
      )}

      {library.data?.batches.map((batch) => (
        <BatchCard
          batch={batch}
          images={library.data.images.filter(
            (image) => image.batchId === batch.id,
          )}
          key={batch.id}
          onDeleteBatch={(value) => setDeleteTarget({ kind: "batch", value })}
          onDeleteImage={(value) => setDeleteTarget({ kind: "image", value })}
        />
      ))}

      <ConfirmDialog
        description={description}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget) && !busy}
        title={
          deleteTarget?.kind === "all"
            ? "همهٔ تصاویر حذف شوند؟"
            : "این مورد حذف شود؟"
        }
      />
      <Snackbar
        autoHideDuration={4500}
        message={locationMessage}
        onClose={() => {
          setNoticeOpen(false);
          navigate(location.pathname, { replace: true, state: null });
        }}
        open={noticeOpen}
      />
    </Stack>
  );
}
