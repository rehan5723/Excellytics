export function classNames(...s) {
  return s.filter(Boolean).join(" ");
}

export function isNumericColumn(data, key) {
  return data.some((row) => typeof row[key] === "number");
}

export function unique(arr) {
  return Array.from(new Set(arr));
}
