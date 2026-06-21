export const MIN_CLIENT_RATE_PER_GUARD = 0.01;
export const MAX_CLIENT_RATE_PER_GUARD = 50000;

export function isClientContractRateValid(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    && amount >= MIN_CLIENT_RATE_PER_GUARD
    && amount <= MAX_CLIENT_RATE_PER_GUARD;
}

export const CLIENT_RATE_PER_GUARD_MESSAGE =
  `Rate per guard must be between PHP ${MIN_CLIENT_RATE_PER_GUARD.toFixed(2)} and PHP ${MAX_CLIENT_RATE_PER_GUARD.toLocaleString()}.`;