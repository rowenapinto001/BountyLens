import { CheckCircle2, GraduationCap, Laptop, ShieldCheck, Wrench } from "lucide-react";
import type { ExperienceLevel } from "../types";

interface ExperienceOption {
  value: ExperienceLevel;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    value: "student",
    title: "Student",
    description: "Learning to code and looking for clear, beginner-friendly issues.",
    icon: GraduationCap
  },
  {
    value: "junior",
    title: "Junior Developer",
    description: "Comfortable with smaller bugs, documentation and focused features.",
    icon: Wrench
  },
  {
    value: "software-engineer",
    title: "Software Engineer",
    description: "Ready for production bugs, features, tests and integrations.",
    icon: Laptop
  },
  {
    value: "senior",
    title: "Senior Engineer",
    description: "Comfortable with architecture, performance and complex engineering work.",
    icon: ShieldCheck
  }
];

interface ExperienceSelectorProps {
  selected?: ExperienceLevel;
  onSelect: (value: ExperienceLevel) => void;
}

export function experienceLabel(level: ExperienceLevel): string {
  return EXPERIENCE_OPTIONS.find((option) => option.value === level)?.title ?? "Unknown";
}

export default function ExperienceSelector({ selected, onSelect }: ExperienceSelectorProps) {
  return (
    <div className="experience-grid" role="radiogroup" aria-label="Experience level">
      {EXPERIENCE_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.value;

        return (
          <button
            className={`experience-card ${isSelected ? "is-selected" : ""}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            <span className="experience-icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <span className="experience-copy">
              <span className="experience-title">{option.title}</span>
              <span className="experience-description">{option.description}</span>
            </span>
            {isSelected ? <CheckCircle2 className="selected-check" size={18} aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  );
}
