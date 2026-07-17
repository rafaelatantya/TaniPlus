import { useCallback } from '@lynx-js/react';
import iconPhone from '../icon_phone.svg';
import iconKey from '../icon_key.svg';
import './TextField.css';

interface TextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: 'text' | 'password' | 'tel';
  icon?: 'phone' | 'key';
}

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon
}: TextFieldProps) {
  const onInput = useCallback((e: any) => {
    onChange(e.detail.value);
  }, [onChange]);

  return (
    <view className="TextFieldContainer">
      <text className="TextFieldLabel">{label}</text>
      <view className="TextFieldInputWrapper">
        {icon === 'phone' && (
          <image src={iconPhone} className="TextFieldIcon" />
        )}
        {icon === 'key' && (
          <image src={iconKey} className="TextFieldIcon" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...({ value } as any)}
          bindinput={onInput}
          className="TextFieldInput"
        />
      </view>
    </view>
  );
}
