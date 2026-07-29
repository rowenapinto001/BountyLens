import { Bookmark, Moon, RefreshCw, Sun } from "lucide-react";
import type { ExperienceLevel, ThemeMode } from "../types";
import { experienceLabel } from "./ExperienceSelector";
import LogoMark from "./LogoMark";

interface HeaderProps {
  experience: ExperienceLevel;
  issueCount: number;
  savedCount: number;
  lastUpdated?: number;
  refreshing: boolean;
  showingSaved: boolean;
  theme: ThemeMode;
  onToggleSaved: () => void;
  onToggleTheme: () => void;
  onRefresh: () => void;
}

export default function Header({
  experience,
  issueCount,
  savedCount,
  lastUpdated,
  refreshing,
  showingSaved,
  theme,
  onToggleSaved,
  onToggleTheme,
  onRefresh
}: HeaderProps) {
  const isDark = theme === "dark";

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-lockup">
          <LogoMark />
          <div>
            <h1>BountyLens</h1>
            <p>GitHub bounties for you</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggleTheme}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className={`icon-button ${showingSaved ? "is-active" : ""}`}
            type="button"
            aria-label={showingSaved ? "Show all bounties" : "Show saved bounties"}
            title={showingSaved ? "Show all bounties" : "Show saved bounties"}
            onClick={onToggleSaved}
          >
            <Bookmark size={18} fill={showingSaved ? "currentColor" : "none"} />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Refresh bounty issues"
            title="Refresh bounty issues"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? "spin" : ""} size={18} />
          </button>
        </div>
      </div>
      <div className="header-bottom">
        <span>{experienceLabel(experience)}</span>
        <span aria-hidden="true">•</span>
        <span>{showingSaved ? savedCount : issueCount} {showingSaved ? "saved" : issueCount === 1 ? "issue" : "issues"}</span>
        {lastUpdated ? (
          <>
            <span className="header-updated-separator" aria-hidden="true">•</span>
            <span className="header-updated">Updated {formatHeaderTime(lastUpdated)}</span>
          </>
        ) : null}
        {refreshing ? <span className="refresh-note" aria-live="polite">Refreshing...</span> : null}
      </div>
    </header>
  );
}

function formatHeaderTime(value: number): string {
  const minutes = Math.max(0, Math.floor((Date.now() - value) / 60_000));
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return `${Math.floor(hours / 24)}d ago`;
}
