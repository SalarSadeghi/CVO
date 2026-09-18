import { create } from "zustand";

import type { DraftImage } from "../../types/domain";
import { createId } from "../../utils/id";
import { selectImageFiles, type FileSelectionResult } from "./captureRules";

interface CaptureState {
  drafts: DraftImage[];
  addFiles: (files: File[]) => FileSelectionResult;
  removeDraft: (id: string) => void;
  clearDrafts: () => void;
}

function revokeDraft(draft: DraftImage): void {
  URL.revokeObjectURL(draft.previewUrl);
}

export const useCaptureStore = create<CaptureState>((set, get) => ({
  drafts: [],
  addFiles: (files) => {
    const current = get().drafts;
    const result = selectImageFiles(current.map((draft) => draft.file), files);
    const additions = result.accepted.map<DraftImage>((file) => ({
      id: createId("draft"),
      file,
      previewUrl: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    }));
    if (additions.length > 0) set({ drafts: [...current, ...additions] });
    return result;
  },
  removeDraft: (id) => {
    const draft = get().drafts.find((item) => item.id === id);
    if (draft) revokeDraft(draft);
    set((state) => ({ drafts: state.drafts.filter((item) => item.id !== id) }));
  },
  clearDrafts: () => {
    get().drafts.forEach(revokeDraft);
    set({ drafts: [] });
  },
}));
