export function currentPeriod(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function dueDateForPeriod(period) {
  const [year, month] = period.split('-').map(Number);
  return new Date(year, month - 1, 15); // 15th of the billing month, matches frontend copy
}
