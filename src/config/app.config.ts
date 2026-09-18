export const APP_CONFIG = {
  name: "CoilVision",
  maxImagesPerRequest: 10,
  maxImageSizeBytes: 12 * 1024 * 1024,
  acceptedImageTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  databaseName: "coilvision-client",
  databaseVersion: 1,
} as const;

export type AcceptedImageType = (typeof APP_CONFIG.acceptedImageTypes)[number];
