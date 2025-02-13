export function getCurrentMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { firstDay, lastDay };
}

export function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });
}
