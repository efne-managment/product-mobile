export function safeDate(v: any) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}