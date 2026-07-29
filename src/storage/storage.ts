import type { ExtensionStorage } from "./types";

export const SCHEMA_VERSION = 1;
export const CACHE_DURATION_MS = 15 * 60 * 1000;

const DEFAULT_STORAGE: ExtensionStorage = {
  schemaVersion: SCHEMA_VERSION
};

export async function getStorage(): Promise<ExtensionStorage> {
  const stored = await chrome.storage.local.get(null);
  return {
    ...DEFAULT_STORAGE,
    ...stored,
    schemaVersion: SCHEMA_VERSION
  } as ExtensionStorage;
}

export async function patchStorage(update: Partial<ExtensionStorage>): Promise<void> {
  await chrome.storage.local.set({
    ...update,
    schemaVersion: SCHEMA_VERSION
  });
}

export function hasValidCache(storage: ExtensionStorage, now = Date.now()): boolean {
  return Boolean(
    storage.issues &&
      storage.issues.length > 0 &&
      storage.lastSuccessfulFetch &&
      now - storage.lastSuccessfulFetch < CACHE_DURATION_MS
  );
}

export function hasExpiredCache(storage: ExtensionStorage, now = Date.now()): boolean {
  return Boolean(storage.issues && storage.issues.length > 0 && storage.lastSuccessfulFetch && now - storage.lastSuccessfulFetch >= CACHE_DURATION_MS);
}
