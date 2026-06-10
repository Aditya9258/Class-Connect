import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  title?: string;
}

export default function OTPInput({ length = 6, onComplete, title = "Enter the code generated on your mobile device below to log in!" }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered somehow
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const otpString = newOtp.join('');
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty, move to previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // If current has value, just clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="bg-[#0B0E17] rounded-3xl p-10 flex flex-col items-center justify-center min-h-[300px] w-full max-w-3xl mx-auto shadow-2xl border border-gray-800">
      <h2 className="text-2xl font-light text-white mb-12 text-center">
        {title}
      </h2>
      <div className="flex items-center gap-3">
        {otp.map((digit, index) => (
          <React.Fragment key={index}>
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-14 h-20 bg-[#16192B] border border-[#2A2E45] rounded-lg text-white text-3xl text-center focus:outline-none focus:border-[#4A55A2] focus:ring-1 focus:ring-[#4A55A2] transition-all"
            />
            {index === 2 && length === 6 && (
              <div className="w-4 h-[2px] bg-gray-600 mx-2 rounded-full" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
