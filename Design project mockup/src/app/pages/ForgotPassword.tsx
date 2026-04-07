import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import { Mail, KeyRound, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState<'email' | 'otp' | 'new_password'>('email');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [otpContextToken, setOtpContextToken] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
       return toast.error('Enter a valid email address');
    }
    
    try {
      setLoading(true);
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      setStep('otp');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('OTP must be 6 digits');

    try {
      setLoading(true);
      const { data } = await api.post('/auth/verify-forgot-otp', { email, otp });
      toast.success('OTP verified!');
      setOtpContextToken(data.token);
      setStep('new_password');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // 3. Final Reset Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error('Fill in all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (!passRegex.test(newPassword)) return toast.error('Password must meet complexity rules. Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.');

    try {
      setLoading(true);
      const { data } = await api.post('/auth/reset-password-with-otp', { 
        password: newPassword, 
        otpContextToken 
      });
      toast.success(data.message || 'Password reset successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
          <p className="text-slate-500 mt-2 text-sm">
            {step === 'email' && "Enter your email and we'll send you an OTP."}
            {step === 'otp' && "We sent a 6-digit OTP to your email."}
            {step === 'new_password' && "Create a secure new password."}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="name@example.com"
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
            </button>
            <div className="text-center pt-4">
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900">Back to Login</Link>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-widest text-2xl font-mono rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="000000"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
            </button>
            <div className="text-center pt-4">
               <button type="button" onClick={handleRequestOtp} className="text-sm font-medium text-blue-600 hover:underline">Resend OTP</button>
               <span className="mx-2 text-slate-300">|</span>
               <button type="button" onClick={() => setStep('email')} className="text-sm font-medium text-slate-500 hover:text-slate-900">Change Email</button>
            </div>
          </form>
        )}

        {step === 'new_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="New secure password"
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Retype password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save New Password'} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
