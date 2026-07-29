import type { ExperienceLevel } from "../types";
import { EXPERIENCE_OPTIONS } from "./ExperienceSelector";

interface ExperienceTabsProps {
  selected: ExperienceLevel;
  onSelect: (experience: ExperienceLevel) => void;
}

export default function ExperienceTabs({ selected, onSelect }: ExperienceTabsProps) {
  return (
    <div className="experience-tabs" role="radiogroup" aria-label="Choose experience level">
      {EXPERIENCE_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        const shortLabel = getShortLabel(option.value);

        return (
          <button
            className={`experience-tab ${isSelected ? "is-selected" : ""}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.title}
            title={option.title}
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}

function getShortLabel(value: ExperienceLevel): string {
  if (value === "junior") {
    return "Junior";
  }
  if (value === "software-engineer") {
    return "Software";
  }
  if (value === "senior") {
    return "Senior";
  }
  return "Student";
}
