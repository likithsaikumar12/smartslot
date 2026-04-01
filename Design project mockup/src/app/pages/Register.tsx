import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Clock, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOwner = location.pathname === '/register/owner';

  // Owner business details
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Turf');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [proof, setProof] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isOwner ? '/auth/register-owner' : '/auth/register/user';
    try {
      const payload: any = isOwner
        ? {
            name,
            email,
            phone,
            password,
            businessName,
            businessType,
            address: businessAddress,
            businessLocation,
            description: businessDescription,
            proof,
          }
        : { name, email, password };

      const { data } = await api.post(endpoint, payload);
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
      toast.success(isOwner ? 'Owner account created!' : 'Account created!');
      if (data.role === 'owner') navigate('/business');
      else navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {isOwner ? 'Register as Owner' : 'Create Account'}
          </h2>
          <p className="text-slate-500 mt-2 text-center">
            {isOwner ? 'List your venue and manage slots on SmartSlot' : 'Join SmartSlot to book services'}
          </p>
        </div>

        {!isOwner && (
          <div className="mb-6 p-3 bg-slate-50 rounded-xl text-center text-sm text-slate-600">
            Listing a business?{' '}
            <Link to="/register/owner" className="text-blue-600 font-semibold inline-flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Owner registration
            </Link>
          </div>
        )}
        {isOwner && (
          <div className="mb-6 p-3 bg-slate-50 rounded-xl text-center text-sm text-slate-600">
            Booking only?{' '}
            <Link to="/register" className="text-blue-600 font-semibold">
              Customer sign up
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {isOwner && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
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
            <p className="text-xs text-slate-500 mt-2">
              Min 8 characters, uppercase, lowercase, number, and special character (@$!%*?&#)
            </p>
          </div>

          {isOwner && (
            <div className="space-y-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-lg font-bold text-slate-900">Business Verification Details</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Apex Sports Arena"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Turf">turf</option>
                  <option value="Salon">salon</option>
                  <option value="Gym">gym</option>
                  <option value="Restaurant">restaurant</option>
                  <option value="Clinic">clinic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address (with location)
                </label>
                <input
                  type="text"
                  required
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="123 Example Street, Suite 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location Identifier</label>
                <input
                  type="text"
                  required
                  value={businessLocation}
                  onChange={(e) => setBusinessLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Downtown Core"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  required
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Briefly describe your business..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof (placeholder)</label>
                <input
                  type="text"
                  required
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Paste document reference or filename (e.g. license.pdf)"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Current implementation stores a text placeholder (no file upload).
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to={isOwner ? '/login/owner' : '/login'}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
