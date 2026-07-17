import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; helper?: string };

export function TextField({ label, helper, id, ...inputProps }: Props) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <label className="field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} {...inputProps} />
      {helper && <small>{helper}</small>}
    </label>
  );
}
