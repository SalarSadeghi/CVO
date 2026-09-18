import assert from "node:assert/strict";
import test from "node:test";
import { APP_CONFIG } from "../../config/app.config.ts";
import { selectImageFiles } from "./captureRules.ts";

function image(name: string, type = "image/jpeg", size = 10): File {
  return new File([new Uint8Array(size)], name, { type, lastModified: 1 });
}

test("accepts supported image files", () => {
  const result = selectImageFiles([], [image("coil.jpg"), image("coil.png", "image/png")]);
  assert.equal(result.accepted.length, 2);
  assert.equal(result.rejected.length, 0);
});

test("rejects unsupported, oversized, and duplicate files", () => {
  const existing = image("existing.jpg");
  const result = selectImageFiles([existing], [
    image("notes.txt", "text/plain"),
    image("large.jpg", "image/jpeg", APP_CONFIG.maxImageSizeBytes + 1),
    existing,
  ]);
  assert.deepEqual(result.rejected.map((item) => item.reason), [
    "unsupported-type",
    "too-large",
    "duplicate",
  ]);
});

test("never accepts more than the configured request limit", () => {
  const files = Array.from({ length: APP_CONFIG.maxImagesPerRequest + 2 }, (_, index) =>
    image(`coil-${index}.jpg`),
  );
  const result = selectImageFiles([], files);
  assert.equal(result.accepted.length, APP_CONFIG.maxImagesPerRequest);
  assert.equal(result.rejected.length, 2);
  assert.ok(result.rejected.every((item) => item.reason === "limit-reached"));
});
