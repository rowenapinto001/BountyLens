import { ArrowUpRight, Bookmark, BookmarkCheck, Clock3, Github, MessageCircle } from "lucide-react";
import type { RankedIssue } from "../ranking/rankIssues";
import { exactDateTime, relativeTimeFromNow } from "../utils/dates";
import { extractRepositoryName } from "../utils/repository";

interface IssueCardProps {
  rankedIssue: RankedIssue;
  isSaved: boolean;
  onToggleSave: (rankedIssue: RankedIssue) => void;
}

export default function IssueCard({ rankedIssue, isSaved, onToggleSave }: IssueCardProps) {
  const { issue } = rankedIssue;
  const repository = extractRepositoryName(issue.repository_url);
  const updatedLabel = relativeTimeFromNow(issue.updated_at);
  const exactUpdated = exactDateTime(issue.updated_at);

  return (
    <article className="issue-card compact-issue-card" tabIndex={0} aria-label={`${repository} issue number ${issue.number}`}>
      <span className="github-avatar" aria-hidden="true">
        <Github size={18} />
      </span>
      <div className="issue-main">
        <p className="repo-line compact-repo-line">{repository} <span aria-hidden="true">•</span> #{issue.number}</p>
        <div className="issue-meta">
          <span title={exactUpdated} aria-label={`Updated ${exactUpdated}`}>
            <Clock3 size={13} aria-hidden="true" />
            Updated {updatedLabel.toLowerCase()}
          </span>
          <span>
            <MessageCircle size={13} aria-hidden="true" />
            {issue.comments} {issue.comments === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
      <div className="card-footer">
        <button
          className={`save-bounty-button ${isSaved ? "is-saved" : ""}`}
          type="button"
          aria-label={isSaved ? `Remove ${repository} issue ${issue.number} from saved bounties` : `Save ${repository} issue ${issue.number}`}
          title={isSaved ? "Remove from saved" : "Save bounty"}
          onClick={() => onToggleSave(rankedIssue)}
        >
          {isSaved ? <BookmarkCheck size={13} aria-hidden="true" /> : <Bookmark size={13} aria-hidden="true" />}
        </button>
        <a
          className="secondary-button github-link"
          href={issue.html_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${repository} issue ${issue.number} on GitHub`}
          title="Open on GitHub"
        >
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
