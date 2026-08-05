import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineBriefcase } from 'react-icons/hi';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <HiOutlineBriefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">JobTrackr</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Land your dream job<br />
            with confidence.
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Track applications, manage interviews, and stay organized throughout your entire job search journey.
          </p>

          {/* Floating cards */}
          <div className="mt-12 space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xs animate-slide-right">
              <p className="text-sm font-medium">📊 15 Applications Tracked</p>
              <p className="text-xs text-white/60 mt-1">3 interviews scheduled this week</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-[280px] ml-8 animate-slide-right animate-delay-200">
              <p className="text-sm font-medium">🎉 Offer received from Netflix!</p>
              <p className="text-xs text-white/60 mt-1">TC: $285k • Respond by Friday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <HiOutlineBriefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">JobTrackr</span>
          </div>

          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Sign in to continue to your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              icon={HiOutlineMail}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              icon={HiOutlineLockClosed}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
            <p className="text-xs font-medium text-primary-700 dark:text-primary-400 mb-1">
              Demo Credentials
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-500">
              Email: demo@example.com • Password: demo1234
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
