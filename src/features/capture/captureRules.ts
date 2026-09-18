import { APP_CONFIG } from "../../config/app.config.ts";

export interface FileRejection {
  name: string;
  reason: "unsupported-type" | "too-large" | "duplicate" | "limit-reached";
}

export interface FileSelectionResult {
  accepted: File[];
  rejected: FileRejection[];
}

function signature(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function selectImageFiles(existing: File[], incoming: File[]): FileSelectionResult {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  const signatures = new Set(existing.map(signature));
  let available = Math.max(0, APP_CONFIG.maxImagesPerRequest - existing.length);

  incoming.forEach((file) => {
    if (!APP_CONFIG.acceptedImageTypes.some((type) => type === file.type)) {
      rejected.push({ name: file.name, reason: "unsupported-type" });
      return;
    }
    if (file.size > APP_CONFIG.maxImageSizeBytes) {
      rejected.push({ name: file.name, reason: "too-large" });
      return;
    }
    if (signatures.has(signature(file))) {
      rejected.push({ name: file.name, reason: "duplicate" });
      return;
    }
    if (available === 0) {
      rejected.push({ name: file.name, reason: "limit-reached" });
      return;
    }
    signatures.add(signature(file));
    accepted.push(file);
    available -= 1;
  });

  return { accepted, rejected };
}
