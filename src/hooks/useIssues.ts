import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchBountyIssues } from "../github/client";
import { hasExpiredCache, hasValidCache } from "../storage/storage";
import type { ExtensionStorage } from "../storage/types";
import type { ExperienceLevel } from "../types";
import { AppError } from "../utils/errors";
import { paginate } from "../utils/pagination";
import { rankIssues } from "../ranking/rankIssues";
import type { RankedIssue } from "../ranking/rankIssues";

export interface IssueState {
  rankedIssues: RankedIssue[];
  visibleIssues: RankedIssue[];
  totalPages: number;
  currentPage: number;
  loading: boolean;
  refreshing: boolean;
  warning: AppError | null;
  error: AppError | null;
  showingCachedResults: boolean;
  refresh: () => Promise<void>;
  setPage: (page: number) => Promise<void>;
}

export function useIssues(
  storage: ExtensionStorage | null,
  experience: ExperienceLevel | undefined,
  updateStorage: (update: Partial<ExtensionStorage>) => Promise<void>
): IssueState {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [warning, setWarning] = useState<AppError | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [showingCachedResults, setShowingCachedResults] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  const rankedIssues = useMemo(() => {
    if (!storage?.issues || !experience) {
      return [];
    }
    return rankIssues(storage.issues, experience);
  }, [storage?.issues, experience]);

  const page = storage?.currentPage ?? 1;
  const paginated = paginate(rankedIssues, page);

  const runFetch = useCallback(
    async (force: boolean) => {
      if (!experience || loadingRef.current) {
        return;
      }

      if (!force && storage && hasValidCache(storage)) {
        setShowingCachedResults(false);
        return;
      }

      if (storage?.rateLimitResetAt && storage.rateLimitResetAt > Date.now()) {
        const rateLimitError = new AppError("rate-limit", "GitHub API rate limit reached.", {
          resetAt: storage.rateLimitResetAt
        });
        if (storage.issues?.length) {
          setWarning(rateLimitError);
          setShowingCachedResults(true);
        } else {
          setError(rateLimitError);
        }
        return;
      }

      if (!force && storage && hasExpiredCache(storage)) {
        setShowingCachedResults(true);
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      loadingRef.current = true;
      setLoading(!storage?.issues?.length);
      setRefreshing(Boolean(storage?.issues?.length));
      setWarning(null);
      setError(null);

      try {
        const result = await fetchBountyIssues(controller.signal);
        await updateStorage({
          issues: result.issues,
          lastSuccessfulFetch: Date.now(),
          currentPage: 1,
          rateLimitResetAt: undefined
        });
        setShowingCachedResults(false);
      } catch (caught) {
        if (controller.signal.aborted) {
          return;
        }

        const appError = caught instanceof AppError ? caught : new AppError("unknown", "An unexpected error occurred.");
        if (appError.kind === "rate-limit" && appError.rateLimit?.resetAt) {
          await updateStorage({ rateLimitResetAt: appError.rateLimit.resetAt });
        }

        if (storage?.issues?.length) {
          setWarning(appError);
          setShowingCachedResults(true);
        } else {
          setError(appError);
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [experience, storage, updateStorage]
  );

  useEffect(() => {
    if (!experience || !storage) {
      return;
    }

    void runFetch(false);

    return () => {
      abortRef.current?.abort();
    };
  }, [experience, storage?.experience]);

  const refresh = useCallback(async () => {
    await runFetch(true);
  }, [runFetch]);

  const setPage = useCallback(
    async (nextPage: number) => {
      await updateStorage({ currentPage: nextPage });
    },
    [updateStorage]
  );

  return {
    rankedIssues,
    visibleIssues: paginated.items,
    totalPages: paginated.totalPages,
    currentPage: paginated.currentPage,
    loading,
    refreshing,
    warning,
    error,
    showingCachedResults,
    refresh,
    setPage
  };
}
