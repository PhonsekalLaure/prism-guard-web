import {
  FaCheck,
  FaCheckCircle,
  FaRegCircle,
  FaTimes,
} from 'react-icons/fa';
import { getPasswordRequirementStatus } from '@utils/passwordPolicy';

export default function PasswordRequirements({
  password,
  passwordsMatch,
  variant = 'shared',
  includeMatch = true,
}) {
  const items = [
    ...getPasswordRequirementStatus(password).map((requirement) => ({
      key: requirement.key,
      label: variant === 'reset' ? requirement.label : requirement.shortLabel,
      isMet: requirement.isMet,
    })),
  ];

  if (includeMatch) {
    items.push({
      key: 'match',
      label: 'Passwords match',
      isMet: passwordsMatch,
    });
  }

  if (variant === 'reset') {
    return (
      <div className="reset-requirements">
        <p className="reset-req-title">Requirements</p>
        {items.map(({ key, label, isMet }) => (
          <div key={key} className={`reset-req-item ${isMet ? 'met' : ''}`}>
            <span className="reset-req-icon">{isMet ? <FaCheck /> : <FaTimes />}</span>
            {label}
          </div>
        ))}
      </div>
    );
  }

  const isCms = variant === 'cms';
  const wrapperClassName = isCms ? 'cms-profile-password-rules' : 'shared-password-rules';
  const gridClassName = isCms ? 'cms-profile-password-rules__grid' : 'shared-password-rules__grid';
  const itemBaseClassName = isCms ? 'cms-profile-password-rule' : 'shared-password-rule';

  return (
    <div className={wrapperClassName}>
      <p>Password Requirements:</p>
      <div className={gridClassName}>
        {items.map(({ key, label, isMet }) => (
          <div key={key} className={`${itemBaseClassName}${isMet ? ' is-met' : ''}`}>
            {isMet ? <FaCheckCircle /> : <FaRegCircle />}
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
