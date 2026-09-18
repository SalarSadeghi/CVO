import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { BatchState, DraftImage } from "../types/domain";
import {
  clearLocalLibrary,
  deleteCaptureBatch,
  deleteStoredImage,
  getLocalLibrary,
  saveCaptureBatch,
} from "./imageRepository";

export const libraryQueryKey = ["local-library"] as const;

export function useLocalLibrary() {
  return useQuery({
    queryKey: libraryQueryKey,
    queryFn: getLocalLibrary,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useSaveCaptureBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ drafts, state }: { drafts: DraftImage[]; state: BatchState }) =>
      saveCaptureBatch(drafts, state),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: libraryQueryKey }),
  });
}

export function useDeleteStoredImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStoredImage,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: libraryQueryKey }),
  });
}

export function useDeleteCaptureBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCaptureBatch,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: libraryQueryKey }),
  });
}

export function useClearLocalLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearLocalLibrary,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: libraryQueryKey }),
  });
}
