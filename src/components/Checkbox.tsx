interface Props { checked: boolean; onChange: (checked: boolean) => void; label: string }

export function Checkbox({ checked, onChange, label }: Props) {
  return (
    <label className="check-control">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
