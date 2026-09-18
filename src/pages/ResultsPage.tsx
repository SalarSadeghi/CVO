import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { StoredImageCard } from "../components/StoredImageCard";
import { ResultDetailsDialog } from "../features/results/ResultDetailsDialog";
import { useLocalLibrary } from "../storage/library.queries";
import type { ImageProcessingStatus, StoredImage } from "../types/domain";

type StatusFilter = "all" | ImageProcessingStatus;

export function ResultsPage() {
  const library = useLocalLibrary();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<StoredImage | null>(null);
  const filteredImages = useMemo(
    () =>
      library.data?.images.filter(
        (image) => filter === "all" || image.analysis.status === filter,
      ) ?? [],
    [filter, library.data?.images],
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        description="وضعیت پردازش و اطلاعات شناسایی‌شدهٔ هر تصویر ذخیره‌شده را بررسی کنید. پس از اتصال سرویس پردازش، نتایج در این بخش قرار می‌گیرند."
        eyebrow="داده‌های پردازش"
        title="نتایج تصاویر"
      />

      <Alert severity="info" variant="outlined">
        در این نسخه ارتباطی با سرویس پردازش وجود ندارد؛ بنابراین تصاویر جدید در
        وضعیت «در انتظار پردازش» باقی می‌مانند.
      </Alert>

      <ToggleButtonGroup
        aria-label="فیلتر نتایج بر اساس وضعیت"
        exclusive
        onChange={(_, value: StatusFilter | null) => value && setFilter(value)}
        size="small"
        value={filter}
        sx={{ alignSelf: "flex-start", flexWrap: "wrap", gap: 4 }}
      >
        {/* <ToggleButton value="all">همه</ToggleButton>
        <ToggleButton value="pending">در انتظار</ToggleButton>
        <ToggleButton value="detected">شناسایی‌شده</ToggleButton>
        <ToggleButton value="not-detected">شناسایی‌نشده</ToggleButton>
        <ToggleButton value="bad-detection">شناسایی نامعتبر</ToggleButton>
        <ToggleButton value="failed">ناموفق</ToggleButton> */}
      </ToggleButtonGroup>

      {library.isPending && (
        <CircularProgress
          aria-label="در حال بارگذاری نتایج"
          sx={{ alignSelf: "center", my: 8 }}
        />
      )}
      {library.isError && (
        <Alert severity="error">باز کردن اطلاعات نتایج ممکن نشد.</Alert>
      )}

      {library.data && library.data.images.length === 0 && (
        <EmptyState
          action={
            <Button
              component={Link}
              startIcon={<AddAPhotoRoundedIcon />}
              to="/"
              variant="contained"
            >
              <Typography sx={{ paddingX: "8px" }}>ثبت تصاویر</Typography>
            </Button>
          }
          description="ابتدا یک مجموعه تصویر ذخیره کنید. هر تصویر و نتیجهٔ پردازش آیندهٔ آن در اینجا نمایش داده می‌شود."
          icon={<AnalyticsRoundedIcon fontSize="large" />}
          title="هنوز نتیجه‌ای وجود ندارد"
        />
      )}

      {library.data &&
        library.data.images.length > 0 &&
        filteredImages.length === 0 && (
          <EmptyState
            description="هیچ‌یک از تصاویر ذخیره‌شده این وضعیت پردازش را ندارند."
            icon={<AnalyticsRoundedIcon fontSize="large" />}
            title="نتیجه‌ای با این وضعیت پیدا نشد"
          />
        )}

      <Grid container spacing={2}>
        {filteredImages.map((image) => (
          <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <StoredImageCard image={image} onOpen={setSelected} />
          </Grid>
        ))}
      </Grid>

      <ResultDetailsDialog image={selected} onClose={() => setSelected(null)} />
    </Stack>
  );
}
