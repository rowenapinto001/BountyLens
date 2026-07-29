import { ArrowUpRight, Bookmark, BookmarkCheck } from "lucide-react";
import type { RankedIssue } from "../ranking/rankIssues";
import { extractRepositoryName } from "../utils/repository";

interface IssueCardProps {
  rankedIssue: RankedIssue;
  isSaved: boolean;
  onToggleSave: (rankedIssue: RankedIssue) => void;
}

export default function IssueCard({ rankedIssue, isSaved, onToggleSave }: IssueCardProps) {
  const { issue } = rankedIssue;
  const repository = extractRepositoryName(issue.repository_url);

  return (
    <article className="issue-card compact-issue-card" tabIndex={0} aria-label={`${repository} issue number ${issue.number}`}>
      <p className="repo-line compact-repo-line">{repository} <span aria-hidden="true">•</span> #{issue.number}</p>
      <div className="card-footer">
        <button
          className={`save-bounty-button ${isSaved ? "is-saved" : ""}`}
          type="button"
          aria-label={isSaved ? `Remove ${repository} issue ${issue.number} from saved bounties` : `Save ${repository} issue ${issue.number}`}
          title={isSaved ? "Remove from saved" : "Save bounty"}
          onClick={() => onToggleSave(rankedIssue)}
        >
          {isSaved ? <BookmarkCheck size={13} aria-hidden="true" /> : <Bookmark size={13} aria-hidden="true" />}
          {isSaved ? "Saved" : "Save"}
        </button>
        <a className="secondary-button github-link" href={issue.html_url} target="_blank" rel="noreferrer">
          Open on GitHub
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
