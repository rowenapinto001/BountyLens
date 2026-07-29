export default function LoadingState() {
  return (
    <section className="loading-state" aria-live="polite" aria-busy="true">
      <div className="skeleton-summary">
        <span className="skeleton-line wide" />
        <span className="skeleton-line" />
        <span className="skeleton-line short" />
      </div>
      <p className="loading-text">Finding open bounty issues...</p>
      <div className="results-list">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="issue-card skeleton-card" key={index}>
            <span className="skeleton-line wide" />
            <span className="skeleton-line" />
            <span className="skeleton-line short" />
            <span className="skeleton-block" />
          </div>
        ))}
      </div>
    </section>
  );
}
