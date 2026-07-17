import { useState, useCallback } from '@lynx-js/react';
import { TextField } from './TextField.js';
import { Checkbox } from './Checkbox.js';
import './Login.css';

interface RegisterProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard' | 'details', data?: any) => void;
}

export function Register({ onNavigate }: RegisterProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleRegister = useCallback(() => {
    onNavigate('dashboard');
  }, [onNavigate]);

  const handleGoToLogin = useCallback(() => {
    onNavigate('login');
  }, [onNavigate]);

  return (
    <view className="LoginScreen">
      <view className="LoginHeader">
        <view className="TitleRow">
          <text className="GetStartedTitle">Get Started Now</text>
        </view>
      </view>

      <view className="LoginCard">
        <view className="TabContainer">
          <view className="TabInactive" bindtap={handleGoToLogin}>
            <text className="TabTextInactive">Login</text>
          </view>
          <view className="TabActive">
            <text className="TabTextActive">Daftar</text>
          </view>
        </view>

        <view className="InputContainer">
          <TextField
            label="Nomor Telepon"
            placeholder="08123xxxxx"
            value={phone}
            onChange={setPhone}
            type="tel"
            icon="phone"
          />
          <TextField
            label="Password"
            placeholder="Masukkan Password Anda"
            value={password}
            onChange={setPassword}
            type="password"
            icon="key"
          />
        </view>

        <view className="OptionsRow">
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Ingat saya"
          />
          <view className="ForgotPasswordLink">
            <text className="LinkText">Lupa password?</text>
          </view>
        </view>

        <view className="PrimaryButton" bindtap={handleRegister}>
          <text className="PrimaryButtonText">Daftar</text>
        </view>
      </view>
    </view>
  );
}
