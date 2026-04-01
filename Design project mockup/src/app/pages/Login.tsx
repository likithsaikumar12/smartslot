import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname === '/admin/login';
  const isOwner = location.pathname === '/login/owner';

  const title = isAdmin ? 'Admin Sign In' : isOwner ? 'Business Owner Login' : 'Welcome Back';
  const subtitle = isAdmin
    ? 'System administration access'
    : isOwner
      ? 'Manage venues, slots, and bookings'
      : 'Sign in to book services and view your bookings';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isAdmin ? '/auth/login/admin' : isOwner ? '/auth/login/owner' : '/auth/login/user';
    try {
      const { data } = await api.post(endpoint, { email, password });
      login(data.token, {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        isVerified: data.isVerified,
        verificationStatus: data.verificationStatus,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        businessType: data.businessType,
      });
      toast.success('Logged in successfully!');
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'owner') navigate('/business');
      else navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              isAdmin ? 'bg-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'
            }`}
          >
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-2 text-center">{subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-white ${
              isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
          >
            Sign In
          </button>
        </form>
        {!isAdmin && (
          <div className="mt-6 text-center text-sm text-slate-600 space-y-2">
            {!isOwner && (
              <p>
                Business owner?{' '}
                <Link to="/login/owner" className="text-blue-600 font-semibold hover:underline">
                  Owner login
                </Link>
              </p>
            )}
            {isOwner && (
              <p>
                Customer?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  User login
                </Link>
              </p>
            )}
            <p>
              {isOwner ? (
                <>
                  New business?{' '}
                  <Link to="/register/owner" className="text-blue-600 font-semibold hover:underline">
                    Register as owner
                  </Link>
                </>
              ) : (
                <>
                  No account?{' '}
                  <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </p>
          </div>
        )}
        {isAdmin && (
          <p className="mt-6 text-center text-xs text-slate-400">
            Admin access is restricted. Use credentials from your deployment configuration.
          </p>
        )}
      </div>
    </div>
  );
}
