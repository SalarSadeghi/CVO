export type BatchState = "saved" | "ready";

export type ImageProcessingStatus =
  | "pending"
  | "detected"
  | "not-detected"
  | "bad-detection"
  | "failed";

export interface ImageAnalysis {
  status: ImageProcessingStatus;
  detectedValue?: string;
  confidence?: number;
  message?: string;
  processedAt?: string;
  raw?: Record<string, unknown>;
}

export interface CaptureBatch {
  id: string;
  state: BatchState;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredImage {
  id: string;
  batchId: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: string;
  analysis: ImageAnalysis;
}

export interface DraftImage {
  id: string;
  file: File;
  previewUrl: string;
  createdAt: string;
}

export interface LocalLibrary {
  batches: CaptureBatch[];
  images: StoredImage[];
}
