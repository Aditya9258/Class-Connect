import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Mail, Lock, ArrowRight, User, Briefcase } from 'lucide-react';

export default function Login() {
  const [loginType, setLoginType] = useState<'student' | 'educator'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a query param or state to set default tab
    if (location.search.includes('type=educator')) {
      setLoginType('educator');
    } else if (location.search.includes('type=student')) {
      setLoginType('student');
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Backend Authentication for Educators
      if (loginType === 'educator') {
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'educator' })
          });
          
          const data = await response.json();
          
          if (data.status === 'success') {
            const user = data.data.user;
            localStorage.setItem('educator_token', data.accessToken);
            localStorage.setItem('logged_in_educator_id', user._id || user.id);
            // Also set these so AuthContext can pick up the user object
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/educator-dashboard';
            return;
          } else {
            if (email === 'aditya@school.edu' && password === 'admin') {
               localStorage.setItem('educator_token', 'mock_token_aditya');
               localStorage.setItem('logged_in_educator_id', '1');
               // Also set these for AuthContext fallback
               localStorage.setItem('accessToken', 'mock_token_aditya');
               localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Dr. Aditya Raj', email: 'aditya@school.edu', role: 'educator' }));
               window.location.href = '/educator-dashboard';
               return;
            }
            setError(data.message || 'Invalid educator email or password.');
            setIsLoading(false);
            return;
          }
        } catch (err) {
          if (email === 'aditya@school.edu' && password === 'admin') {
             localStorage.setItem('educator_token', 'mock_token_aditya');
             localStorage.setItem('logged_in_educator_id', '1');
             localStorage.setItem('accessToken', 'mock_token_aditya');
             localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Dr. Aditya Raj', email: 'aditya@school.edu', role: 'educator' }));
             window.location.href = '/educator-dashboard';
             return;
          }
          setError('Server error. Could not connect to the database.');
          setIsLoading(false);
          return;
        }
      }

      // Backend Authentication for Students
      if (loginType === 'student') {
        try {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'student' })
          });
          
          const data = await response.json();
          
          if (data.status === 'success') {
            const user = data.data.user;
            localStorage.setItem('student_token', data.accessToken);
            localStorage.setItem('logged_in_student_id', user._id || user.id);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/student';
            return;
          } else {
            // Fallback for demo purposes if backend fails auth
            if (email === 'aditya@school.edu' && password === 'student') {
               localStorage.setItem('student_token', 'mock_token_student');
               localStorage.setItem('logged_in_student_id', '1');
               localStorage.setItem('accessToken', 'mock_token_student');
               localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Aditya Student', email: 'aditya@school.edu', role: 'student' }));
               window.location.href = '/student';
               return;
            }
            setError(data.message || 'Invalid student email or password.');
            setIsLoading(false);
            return;
          }
        } catch (err) {
          // Fallback if server is down
          if (email === 'aditya@school.edu' && password === 'student') {
             localStorage.setItem('student_token', 'mock_token_student');
             localStorage.setItem('logged_in_student_id', '1');
             localStorage.setItem('accessToken', 'mock_token_student');
             localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Aditya Student', email: 'aditya@school.edu', role: 'student' }));
             window.location.href = '/student';
             return;
          }
          setError('Server error. Could not connect to the database.');
          setIsLoading(false);
          return;
        }
      }

      setError('Invalid credentials.');
      setIsLoading(false);
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = loginType === 'student';

  return (
    <div className={`min-h-screen pt-28 pb-20 flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500 ${isStudent ? 'bg-[#FAF9F6]' : 'bg-[#1B1F3B]'}`}>
      
      {/* Background decorations */}
      {isStudent ? (
        <>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1B1F3B]/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <img src="/images/hero-img.jpg" alt="Background" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        </>
      )}

      <div className={`w-full max-w-md rounded-[32px] shadow-2xl p-8 sm:p-12 relative z-[60] transition-colors duration-500 ${isStudent ? 'bg-white border border-[#E5D3B3]/40' : 'bg-[#FAF9F6] border border-[#D4AF37]/20 shadow-black/40'}`}>
        
        {/* Toggle Switch */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-8 relative">
          <div 
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out"
            style={{ transform: isStudent ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button 
            type="button"
            onClick={() => setLoginType('student')}
            className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${isStudent ? 'text-[#1B1F3B]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Student
          </button>
          <button 
            type="button"
            onClick={() => setLoginType('educator')}
            className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${!isStudent ? 'text-[#1B1F3B]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Educator
          </button>
        </div>

        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-colors duration-500 ${isStudent ? 'bg-[#1B1F3B] shadow-[#1B1F3B]/20' : 'bg-[#D4AF37] shadow-[#D4AF37]/30'}`}>
            {isStudent ? (
              <User size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
            ) : (
              <Briefcase size={28} className="text-white" strokeWidth={1.5} />
            )}
          </div>
          <h1 className="text-3xl font-bold text-[#1B1F3B] mb-3 transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isStudent ? 'Student Portal' : 'Educator Portal'}
          </h1>
          <p className="text-gray-500 text-sm transition-colors duration-300">
            {isStudent ? 'Welcome back! Please enter your details.' : 'Secure access for teachers and staff.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
              {isStudent ? 'Student ID / Email' : 'Staff Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5D3B3]/60 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder={isStudent ? "Enter your student email" : "teacher@school.edu"}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5D3B3]/60 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className={`w-4 h-4 rounded border-gray-300 focus:ring-2 transition-colors ${isStudent ? 'text-[#1B1F3B] focus:ring-[#1B1F3B]' : 'text-[#D4AF37] focus:ring-[#D4AF37]'}`} />
              <span className="text-sm text-gray-500 group-hover:text-[#1B1F3B] transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-sm font-semibold text-[#D4AF37] hover:text-[#1B1F3B] transition-colors">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors duration-300 group shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            } ${isStudent ? 'bg-[#1B1F3B] hover:bg-[#D4AF37] shadow-[#1B1F3B]/10' : 'bg-[#D4AF37] hover:bg-[#1B1F3B] shadow-[#D4AF37]/20'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking Credentials...
              </>
            ) : (isStudent ? 'Log In to Student Portal' : 'Log In to Educator Portal')}
            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            {isStudent ? (
              <>Don't have an account? <a href="#" className="font-semibold text-[#1B1F3B] hover:text-[#D4AF37] transition-colors">Contact Administrator</a></>
            ) : (
              <>Need IT assistance? <a href="#" className="font-semibold text-[#1B1F3B] hover:text-[#D4AF37] transition-colors">Contact Tech Support</a></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
