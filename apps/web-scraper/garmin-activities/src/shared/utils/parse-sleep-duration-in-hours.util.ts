export function parseSleepDurationInHours(duration: string): number {
  const match = duration.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  const hours = parseInt(match?.[1] ?? '0', 10);
  const minutes = parseInt(match?.[2] ?? '0', 10);
  return Number((hours + minutes / 60).toFixed(4)); // 7.05
}
