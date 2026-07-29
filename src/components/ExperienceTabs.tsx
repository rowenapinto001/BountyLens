import { Code2, Crown, GraduationCap, UserRound } from "lucide-react";
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
        const Icon = getIcon(option.value);

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
            <Icon size={14} aria-hidden="true" />
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}

function getIcon(value: ExperienceLevel) {
  if (value === "junior") {
    return UserRound;
  }
  if (value === "software-engineer") {
    return Code2;
  }
  if (value === "senior") {
    return Crown;
  }
  return GraduationCap;
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
