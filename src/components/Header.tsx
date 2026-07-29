import { Bookmark, Moon, RefreshCw, Sun } from "lucide-react";
import type { ThemeMode } from "../types";
import LogoMark from "./LogoMark";

interface HeaderProps {
  refreshing: boolean;
  showingSaved: boolean;
  theme: ThemeMode;
  onToggleSaved: () => void;
  onToggleTheme: () => void;
  onRefresh: () => void;
}

export default function Header({
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
    </header>
  );
}
