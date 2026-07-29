import { useCallback, useEffect, useState } from "react";
import { getStorage, patchStorage } from "../storage/storage";
import type { ExtensionStorage } from "../storage/types";

export function useStorage() {
  const [storage, setStorage] = useState<ExtensionStorage | null>(null);

  useEffect(() => {
    let mounted = true;

    getStorage().then((value) => {
      if (mounted) {
        setStorage(value);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const updateStorage = useCallback(async (update: Partial<ExtensionStorage>) => {
    await patchStorage(update);
    setStorage((current) => ({ schemaVersion: 1, ...current, ...update }));
  }, []);

  return { storage, setStorage, updateStorage };
}
