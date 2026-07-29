import { useState } from "react";
import type { ExperienceLevel } from "../types";
import ExperienceSelector from "./ExperienceSelector";

interface OnboardingProps {
  onComplete: (experience: ExperienceLevel) => Promise<void>;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selected, setSelected] = useState<ExperienceLevel | undefined>();
  const [saving, setSaving] = useState(false);

  async function handleComplete() {
    if (!selected) {
      return;
    }
    setSaving(true);
    await onComplete(selected);
    setSaving(false);
  }

  return (
    <main className="onboarding-shell">
      <div className="brand-lockup large">
        <div className="logo-mark" aria-hidden="true">BL</div>
        <div>
          <h1>BountyLens</h1>
          <p>Find GitHub bounties that match your experience.</p>
        </div>
      </div>

      <section className="panel-section" aria-labelledby="experience-question">
        <h2 id="experience-question">What best describes your experience?</h2>
        <ExperienceSelector selected={selected} onSelect={setSelected} />
        <button className="primary-button full-width" type="button" disabled={!selected || saving} onClick={handleComplete}>
          {saving ? "Saving..." : "Find bounties"}
        </button>
      </section>
    </main>
  );
}
