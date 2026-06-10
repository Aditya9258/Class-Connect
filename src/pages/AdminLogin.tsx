import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Key, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [otpToken, setOtpToken] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [tempData, setTempData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, role: 'super-admin' })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        const user = data.data.user;
        if (user.otpEnabled) {
          setTempData(data);
          setStep(2);
        } else {
          login(data.accessToken, user);
          navigate('/admin-dashboard');
        }
      } else {
        // Fallback for hardcoded admin if database isn't working
        if (username === 'admin' && password === 'secure778899') {
          localStorage.setItem('admin_token', 'true');
          navigate('/admin-dashboard');
        } else {
          setError(data.message || 'Invalid administrator credentials.');
        }
      }
    } catch (err) {
      // Complete fallback
      if (username === 'admin' && password === 'secure778899') {
        localStorage.setItem('admin_token', 'true');
        navigate('/admin-dashboard');
      } else {
        setError('Server error. Could not connect to the database.');
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempData.accessToken}`
        },
        body: JSON.stringify({ token: otpToken })
      });
      const data = await response.json();
      if (data.verified) {
        login(tempData.accessToken, tempData.data.user);
        navigate('/admin-dashboard');
      } else {
        setOtpStatus('Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setOtpStatus('Server error verifying OTP.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1F3B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#D4AF37]/30">
            <Shield className="text-[#1B1F3B]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 mt-2 text-center text-sm">Secure access strictly for administrators.</p>
        </div>

        {error && step === 1 && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1B1F3B]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1B1F3B]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-[#1B1F3B] font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group"
            >
              Authenticate
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
               <Key size={48} />
            </div>
            <p className="text-white font-bold mt-6 text-xl">Two-Factor Authentication</p>
            <p className={`text-sm ${otpStatus.includes('Invalid') || otpStatus.includes('error') ? 'text-red-400' : 'text-emerald-400'} text-center font-medium`}>
              {otpStatus || 'Enter the 6-digit code from your Authenticator app.'}
            </p>
            <div className="pt-6 flex flex-col gap-3 w-full">
              <input 
                type="text" 
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                placeholder="000000"
                className="w-full bg-[#1B1F3B]/50 border border-white/10 rounded-xl py-3 text-center tracking-widest font-mono text-xl text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <button 
                onClick={handleVerifyOTP}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors mt-2 shadow-lg"
              >
                Verify Code
              </button>
              <button 
                onClick={() => { setStep(1); setOtpStatus(''); setOtpToken(''); }}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl transition-colors mt-2"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
