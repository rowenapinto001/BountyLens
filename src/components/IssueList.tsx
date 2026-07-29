import type { RankedIssue } from "../ranking/rankIssues";
import IssueCard from "./IssueCard";

interface IssueListProps {
  issues: RankedIssue[];
  listRef: React.RefObject<HTMLDivElement>;
  savedIssueIds: Set<number>;
  onToggleSave: (rankedIssue: RankedIssue) => void;
}

export default function IssueList({ issues, listRef, savedIssueIds, onToggleSave }: IssueListProps) {
  return (
    <div className="results-list" ref={listRef}>
      {issues.map((rankedIssue) => (
        <IssueCard
          rankedIssue={rankedIssue}
          isSaved={savedIssueIds.has(rankedIssue.issue.id)}
          onToggleSave={onToggleSave}
          key={rankedIssue.issue.id}
        />
      ))}
    </div>
  );
}
