import { useCallback } from '@lynx-js/react';
import './Checkbox.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const onTap = useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <view className="CheckboxContainer" bindtap={onTap}>
      <view className={`CheckboxSquare ${checked ? 'CheckboxChecked' : ''}`}>
        {checked && <view className="CheckboxCheckmark" />}
      </view>
      <text className="CheckboxLabel">{label}</text>
    </view>
  );
}
