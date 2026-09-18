import { APP_CONFIG } from "../config/app.config";
import type {
  BatchState,
  CaptureBatch,
  DraftImage,
  ImageAnalysis,
  LocalLibrary,
  StoredImage,
} from "../types/domain";
import { createId } from "../utils/id";

const BATCH_STORE = "batches";
const IMAGE_STORE = "images";

let databasePromise: Promise<IDBDatabase> | null = null;

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction was aborted."));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(APP_CONFIG.databaseName, APP_CONFIG.databaseVersion);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(BATCH_STORE)) {
        const batches = database.createObjectStore(BATCH_STORE, { keyPath: "id" });
        batches.createIndex("createdAt", "createdAt");
      }
      if (!database.objectStoreNames.contains(IMAGE_STORE)) {
        const images = database.createObjectStore(IMAGE_STORE, { keyPath: "id" });
        images.createIndex("batchId", "batchId");
        images.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        databasePromise = null;
      };
      resolve(database);
    };
    request.onerror = () => {
      databasePromise = null;
      reject(request.error ?? new Error("Could not open local image storage."));
    };
  });

  return databasePromise;
}

export async function saveCaptureBatch(drafts: DraftImage[], state: BatchState): Promise<CaptureBatch> {
  if (drafts.length === 0) throw new Error("At least one image is required.");
  if (drafts.length > APP_CONFIG.maxImagesPerRequest) {
    throw new Error(`A batch can contain at most ${APP_CONFIG.maxImagesPerRequest} images.`);
  }

  const database = await openDatabase();
  const timestamp = new Date().toISOString();
  const batch: CaptureBatch = {
    id: createId("batch"),
    state,
    imageCount: drafts.length,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const transaction = database.transaction([BATCH_STORE, IMAGE_STORE], "readwrite");
  transaction.objectStore(BATCH_STORE).put(batch);
  const imageStore = transaction.objectStore(IMAGE_STORE);

  drafts.forEach((draft) => {
    const image: StoredImage = {
      id: createId("image"),
      batchId: batch.id,
      name: draft.file.name,
      type: draft.file.type,
      size: draft.file.size,
      blob: draft.file,
      createdAt: draft.createdAt,
      analysis: { status: "pending" },
    };
    imageStore.put(image);
  });

  await transactionToPromise(transaction);
  return batch;
}

export async function getLocalLibrary(): Promise<LocalLibrary> {
  const database = await openDatabase();
  const transaction = database.transaction([BATCH_STORE, IMAGE_STORE], "readonly");
  const [batches, images] = await Promise.all([
    requestToPromise(transaction.objectStore(BATCH_STORE).getAll() as IDBRequest<CaptureBatch[]>),
    requestToPromise(transaction.objectStore(IMAGE_STORE).getAll() as IDBRequest<StoredImage[]>),
  ]);

  return {
    batches: batches.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    images: images.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export async function deleteStoredImage(imageId: string): Promise<void> {
  const database = await openDatabase();
  const readTransaction = database.transaction(IMAGE_STORE, "readonly");
  const image = await requestToPromise(
    readTransaction.objectStore(IMAGE_STORE).get(imageId) as IDBRequest<StoredImage | undefined>,
  );
  if (!image) return;

  const deleteTransaction = database.transaction(IMAGE_STORE, "readwrite");
  deleteTransaction.objectStore(IMAGE_STORE).delete(imageId);
  await transactionToPromise(deleteTransaction);

  const remainingTransaction = database.transaction(IMAGE_STORE, "readonly");
  const remaining = await requestToPromise(
    remainingTransaction.objectStore(IMAGE_STORE).index("batchId").getAll(image.batchId) as IDBRequest<StoredImage[]>,
  );

  const batchTransaction = database.transaction(BATCH_STORE, "readwrite");
  const batchStore = batchTransaction.objectStore(BATCH_STORE);
  if (remaining.length === 0) {
    batchStore.delete(image.batchId);
  } else {
    const batch = await requestToPromise(batchStore.get(image.batchId) as IDBRequest<CaptureBatch | undefined>);
    if (batch) {
      batchStore.put({ ...batch, imageCount: remaining.length, updatedAt: new Date().toISOString() });
    }
  }
  await transactionToPromise(batchTransaction);
}

export async function deleteCaptureBatch(batchId: string): Promise<void> {
  const database = await openDatabase();
  const lookupTransaction = database.transaction(IMAGE_STORE, "readonly");
  const imageIds = await requestToPromise(
    lookupTransaction.objectStore(IMAGE_STORE).index("batchId").getAllKeys(batchId),
  );

  const transaction = database.transaction([BATCH_STORE, IMAGE_STORE], "readwrite");
  transaction.objectStore(BATCH_STORE).delete(batchId);
  const imageStore = transaction.objectStore(IMAGE_STORE);
  imageIds.forEach((id) => imageStore.delete(id));
  await transactionToPromise(transaction);
}

export async function clearLocalLibrary(): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([BATCH_STORE, IMAGE_STORE], "readwrite");
  transaction.objectStore(BATCH_STORE).clear();
  transaction.objectStore(IMAGE_STORE).clear();
  await transactionToPromise(transaction);
}

/** Reserved for the future backend integration layer. */
export async function updateStoredImageAnalysis(imageId: string, analysis: ImageAnalysis): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(IMAGE_STORE, "readwrite");
  const store = transaction.objectStore(IMAGE_STORE);
  const image = await requestToPromise(store.get(imageId) as IDBRequest<StoredImage | undefined>);
  if (!image) throw new Error("The selected image no longer exists.");
  store.put({ ...image, analysis });
  await transactionToPromise(transaction);
}
