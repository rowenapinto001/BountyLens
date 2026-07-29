import { useMemo, useRef, useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ExperienceTabs from "../components/ExperienceTabs";
import Header from "../components/Header";
import IssueList from "../components/IssueList";
import LoadingState from "../components/LoadingState";
import Onboarding from "../components/Onboarding";
import Pagination from "../components/Pagination";
import { useIssues } from "../hooks/useIssues";
import { useStorage } from "../hooks/useStorage";
import { rankIssues } from "../ranking/rankIssues";
import type { RankedIssue } from "../ranking/rankIssues";
import type { ExperienceLevel } from "../types";
import { paginate } from "../utils/pagination";

export default function App() {
  const { storage, updateStorage } = useStorage();
  const [showingSaved, setShowingSaved] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const experience = storage?.experience;
  const issueState = useIssues(storage, experience, updateStorage);
  const savedIssues = storage?.savedIssues ?? [];
  const savedIssueIds = useMemo(() => new Set(savedIssues.map((issue) => issue.id)), [savedIssues]);
  const savedRankedIssues = useMemo(() => (experience ? rankIssues(savedIssues, experience) : []), [savedIssues, experience]);
  const savedPagination = paginate(savedRankedIssues, storage?.currentPage ?? 1);

  async function saveExperience(nextExperience: ExperienceLevel) {
    await updateStorage({ experience: nextExperience, currentPage: 1 });
  }

  async function handlePageChange(page: number) {
    await issueState.setPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function toggleSavedView() {
    setShowingSaved((current) => !current);
    await issueState.setPage(1);
  }

  async function toggleSavedIssue(rankedIssue: RankedIssue) {
    const savedIssues = storage?.savedIssues ?? [];
    const isSaved = savedIssues.some((issue) => issue.id === rankedIssue.issue.id);
    const nextSavedIssues = isSaved
      ? savedIssues.filter((issue) => issue.id !== rankedIssue.issue.id)
      : [rankedIssue.issue, ...savedIssues.filter((issue) => issue.id !== rankedIssue.issue.id)];

    await updateStorage({ savedIssues: nextSavedIssues });
  }

  if (!storage) {
    return <div className="boot-screen" aria-live="polite">Loading BountyLens...</div>;
  }

  if (!experience) {
    return <Onboarding onComplete={saveExperience} />;
  }

  const hasResults = issueState.rankedIssues.length > 0;
  const visibleIssues = showingSaved ? savedPagination.items : issueState.visibleIssues;
  const currentPage = showingSaved ? savedPagination.currentPage : issueState.currentPage;
  const totalPages = showingSaved ? savedPagination.totalPages : issueState.totalPages;
  const hasVisibleResults = visibleIssues.length > 0;

  return (
    <div className="app-shell">
      <Header
        experience={experience}
        issueCount={issueState.rankedIssues.length}
        savedCount={savedIssues.length}
        lastUpdated={storage.lastSuccessfulFetch}
        refreshing={issueState.refreshing || issueState.loading}
        showingSaved={showingSaved}
        onToggleSaved={() => void toggleSavedView()}
        onRefresh={() => void issueState.refresh()}
      />

      {issueState.loading ? (
        <LoadingState />
      ) : (
        <main className="main-content">
          <ExperienceTabs selected={experience} onSelect={(nextExperience) => void saveExperience(nextExperience)} />
          <p className="results-notice">Availability is not guaranteed. Check the GitHub discussion before starting.</p>

          {issueState.warning ? <ErrorState error={issueState.warning} hasCachedResults={hasResults} /> : null}
          {issueState.error ? <ErrorState error={issueState.error} hasCachedResults={hasResults} /> : null}
          {issueState.showingCachedResults && !issueState.warning ? <p className="cache-note inline">Showing cached results.</p> : null}

          {showingSaved && !hasVisibleResults ? (
            <section className="message-state" aria-live="polite">
              <h2>No saved bounties yet</h2>
              <p>Open a bounty on GitHub, then use Save to keep it here for later.</p>
            </section>
          ) : null}

          {!showingSaved && !issueState.error && !hasResults ? <EmptyState onRefresh={() => void issueState.refresh()} /> : null}

          {hasVisibleResults ? (
            <>
              <IssueList
                issues={visibleIssues}
                listRef={resultsRef}
                savedIssueIds={savedIssueIds}
                onToggleSave={(rankedIssue) => void toggleSavedIssue(rankedIssue)}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => void handlePageChange(page)}
              />
            </>
          ) : null}
        </main>
      )}
    </div>
  );
}
