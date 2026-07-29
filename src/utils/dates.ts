export function relativeTimeFromNow(value: string | number | Date, now = Date.now()): string {
  const date = value instanceof Date ? value : new Date(value);
  const diffMs = now - date.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSeconds < 45) {
    return "Just now";
  }

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diffSeconds < hour) {
    return formatUnit(Math.floor(diffSeconds / minute), "minute");
  }
  if (diffSeconds < day) {
    return formatUnit(Math.floor(diffSeconds / hour), "hour");
  }
  if (diffSeconds < month) {
    return formatUnit(Math.floor(diffSeconds / day), "day");
  }
  if (diffSeconds < year) {
    return formatUnit(Math.floor(diffSeconds / month), "month");
  }

  return formatUnit(Math.floor(diffSeconds / year), "year");
}

export function exactDateTime(value: string | number | Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatUnit(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}
