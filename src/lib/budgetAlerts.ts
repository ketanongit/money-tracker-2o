const THRESHOLDS = [10000, 5000, 2000];
let alertsSentThisMonth: Set<number> = new Set();

export async function checkBudgetAlerts(remainingBudget: number) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const storageKey = `budgetAlerts_${currentMonth}`;

  // Reset alerts for new month
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(storageKey)) {
      alertsSentThisMonth = new Set();
      localStorage.setItem(storageKey, JSON.stringify(Array.from(alertsSentThisMonth)));
    } else {
      alertsSentThisMonth = new Set(JSON.parse(localStorage.getItem(storageKey)!));
    }
  }

  for (const threshold of THRESHOLDS) {
    if (remainingBudget <= threshold && !alertsSentThisMonth.has(threshold)) {
      try {
        const response = await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remainingBudget, threshold }),
        });

        if (response.ok) {
          alertsSentThisMonth.add(threshold);
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(alertsSentThisMonth)));
          }
        }
      } catch (error) {
        console.error('Failed to send budget alert:', error);
      }
    }
  }
}
