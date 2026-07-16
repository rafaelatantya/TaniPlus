import { useCallback } from '@lynx-js/react';
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
          <view className="TextFieldIcon PhoneIcon">
            <view className="PhoneIconBody" />
            <view className="PhoneIconDot" />
          </view>
        )}
        {icon === 'key' && (
          <view className="TextFieldIcon KeyIcon">
            <view className="KeyIconRing" />
            <view className="KeyIconBar" />
          </view>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...({ value } as any)}
          bindinput={onInput}
          className="TextFieldInput"
        />
        <view className="TextFieldEndIcon">
          <view className="ArrowRight" />
        </view>
      </view>
    </view>
  );
}
