interface EmptyStateProps {
  onRefresh: () => void;
}

export default function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <section className="message-state" aria-live="polite">
      <h2>No open bounty issues found</h2>
      <p>GitHub does not currently have any open issues matching the exact <code>bounty</code> label in the retrieved results.</p>
      <div className="state-actions">
        <button className="primary-button" type="button" onClick={onRefresh}>Refresh</button>
        <button className="ghost-button" type="button" onClick={onRefresh}>Try again later</button>
      </div>
    </section>
  );
}
