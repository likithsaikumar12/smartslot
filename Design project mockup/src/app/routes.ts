import { createBrowserRouter, redirect } from 'react-router';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { MyBookings } from './pages/MyBookings';
import { UserDashboard } from './pages/UserDashboard';
import { Deals } from './pages/Deals';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { ResetPassword } from './pages/ResetPassword';
import { Layout } from './components/Layout';

import { ForgotPassword } from './pages/ForgotPassword';

const requireAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return redirect('/login');
  }
  return null;
};

const requireUserCustomer = () => {
  const token = localStorage.getItem('token');
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : {};
  if (!token) return redirect('/login');
  if (user.role === 'admin') return redirect('/admin');
  if (user.role === 'owner') return redirect('/business');
  return null;
};

const requireOwner = () => {
  const token = localStorage.getItem('token');
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : {};
  if (!token) return redirect('/login/owner');
  if (user.role !== 'owner' && user.role !== 'admin') {
    return redirect('/');
  }
  return null;
};

const requireAdmin = () => {
  const token = localStorage.getItem('token');
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : {};
  if (!token) return redirect('/admin/login');
  if (user.role !== 'admin') {
    return redirect('/');
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'services', Component: Services },
      { path: 'service/:id', Component: ServiceDetail },
      { path: 'dashboard', Component: UserDashboard, loader: requireUserCustomer },
      { path: 'bookings', Component: MyBookings, loader: requireAuth },
      { path: 'deals', Component: Deals },
      { path: 'business', Component: BusinessDashboard, loader: requireOwner },
      { path: 'admin', Component: AdminDashboard, loader: requireAdmin },
      { path: 'profile', Component: Profile, loader: requireAuth },
    ],
  },
  { path: '/login', Component: Login },
  { path: '/forgot-password', Component: ForgotPassword },
  { path: '/reset-password', Component: ResetPassword },
  { path: '/login/owner', Component: Login },
  { path: '/admin/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/register/owner', Component: Register },
]);
