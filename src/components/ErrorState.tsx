import type { AppError } from "../utils/errors";
import { exactDateTime } from "../utils/dates";

interface ErrorStateProps {
  error: AppError;
  hasCachedResults: boolean;
}

export default function ErrorState({ error, hasCachedResults }: ErrorStateProps) {
  const copy = getCopy(error);

  return (
    <section className={`message-state ${hasCachedResults ? "warning-state" : ""}`} aria-live="polite">
      <h2>{copy.title}</h2>
      <p>{copy.message}</p>
      {error.kind === "rate-limit" && error.rateLimit?.resetAt ? (
        <p className="reset-note">Reset time: {exactDateTime(error.rateLimit.resetAt)}</p>
      ) : null}
      {hasCachedResults ? <p className="cache-note">Showing cached results.</p> : null}
    </section>
  );
}

function getCopy(error: AppError): { title: string; message: string } {
  if (error.kind === "offline") {
    return {
      title: "You appear to be offline",
      message: "Connect to the internet and try again. Previously cached results may still be available."
    };
  }
  if (error.kind === "rate-limit") {
    return {
      title: "GitHub request limit reached",
      message: "BountyLens uses GitHub's free public API. Try again after the displayed reset time."
    };
  }
  if (error.kind === "malformed") {
    return {
      title: "Results could not be processed",
      message: "GitHub returned data that BountyLens could not understand."
    };
  }
  return {
    title: "GitHub could not be reached",
    message: "BountyLens could not load new issues. Please try again."
  };
}
