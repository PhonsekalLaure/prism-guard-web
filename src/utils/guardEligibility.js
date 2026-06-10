export const MIN_HEIGHT_CM_BY_GENDER = Object.freeze({
  male: 162.56,
  female: 157.48,
});
export const MAX_GUARD_HEIGHT_CM = 230;

export function getGuardHeightError(gender, heightCm, subject = 'Employee') {
  const normalizedGender = typeof gender === 'string' ? gender.trim().toLowerCase() : '';
  const minimumHeight = MIN_HEIGHT_CM_BY_GENDER[normalizedGender];
  if (!minimumHeight) return 'Gender must be Male or Female.';

  const numericHeight = Number(heightCm);
  if (!Number.isFinite(numericHeight)) return 'Height is required.';
  if (numericHeight > MAX_GUARD_HEIGHT_CM) {
    return `Height cannot exceed ${MAX_GUARD_HEIGHT_CM} cm.`;
  }
  if (numericHeight < minimumHeight) {
    const heightLabel = normalizedGender === 'male' ? "5'4\"" : "5'2\"";
    return `${subject} must be at least ${heightLabel} (${minimumHeight} cm) tall.`;
  }

  return '';
}
