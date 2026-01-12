
import React, { useState, CSSProperties } from 'react'; // Added CSSProperties
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [generatedOtp, setgeneratedOtp] = useState('');

  // 1. Define the Background Styling
  const backgroundStyle: CSSProperties = {
    // We use a linear-gradient overlay so the white login card stays readable
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://th.bing.com/th/id/OIP.YJfuiFnsVyAjN6r1ZyotWgHaEK?w=307&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setgeneratedOtp(newOtp);
      setStep('otp');
      setLoading(false);
      alert(`Demo Mode: OTP sent to ${email}: ${newOtp}`);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (otp === generatedOtp) {
        onLogin({
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          role: role,
          avatar: `https://picsum.photos/seed/${email}/100/100`,
          user: function (user: any, title: string, reminderTime: string): unknown {
            throw new Error('Function not implemented.');
          },
          username: '',
          isActive: false,
          reminderTime: ''
        });
      } else {
        alert("Invalid OTP!");
        setLoading(false);
      }
    }, 800);
  };
const handleLoginSuccess = (email: string) => {
  localStorage.setItem(
    "user",
    JSON.stringify({ email })
  );
};

  return (
    // 2. Apply backgroundStyle here
    <div 
      style={backgroundStyle} 
      className="min-h-screen w-full flex items-center justify-center p-6"
    >
      {/* 3. Added 'backdrop-blur-md' and 'bg-white/90' for a modern glass effect */}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        
        <div className="flex-1 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center"> Todo List</h2>
            <h3 className="text-center text-black">"A to‑do list is your quiet promise to own the day."</h3>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/50 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    User
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Verification Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm tracking-widest font-mono text-center bg-white/50"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <p className="mt-3 text-[10px] text-gray-400 text-center">
                  We sent a code to <span className="text-gray-600 font-semibold">{email}</span>
                </p>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
              <button 
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-xs text-blue-600 font-semibold hover:underline"
              >
                Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;