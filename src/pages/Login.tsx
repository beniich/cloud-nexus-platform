import React, { useState } from 'react';
import { Cloud, Mail, Lock, User, Eye, EyeOff, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const DEMO_ROLES = [
    { id: 'admin', label: 'Admin', email: 'admin@cloud-nexus.com', pass: 'admin123', icon: Lock, color: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' },
    { id: 'seller', label: 'Vendeur', email: 'vendor@cloud-nexus.com', pass: 'vendor123', icon: Cloud, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' },
    { id: 'client', label: 'Client', email: 'client@cloud-nexus.com', pass: 'client123', icon: User, color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' },
  ];

  const fillCredentials = (role: typeof DEMO_ROLES[0]) => {
    setFormData(prev => ({ ...prev, email: role.email, password: role.pass }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* New Hook Usage */
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-stone-100 flex items-center justify-center p-6">
      {/* Logo Header */}
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-xl">
        {/* Welcome Message - Only on Login */}
        {isLogin && (
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Bienvenue</h1>
            <p className="text-gray-600 text-lg">Connectez-vous ou créez un compte</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Authentification</h2>
            <p className="text-gray-600">Accédez à votre espace Cloud Industrie</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {/* Quick Login Roles - Demo Only */}
          {isLogin && (
            <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                Accès Rapide (Démo)
              </p>
              <div className="grid grid-cols-3 gap-3">
                {DEMO_ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => fillCredentials(role)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all transform hover:scale-105 ${role.color}`}
                  >
                    <role.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex gap-2 p-2 bg-gray-100 rounded-full mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${isLogin
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${!isLogin
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Inscription
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Registration Fields */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Only on Register */}
            {!isLogin && (
              <div>
                <label className="block text-gray-900 font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password - Only on Login */}
            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-orange-400/30 transition-all transform hover:scale-[1.02]"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600 font-medium">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700">
                <Github className="w-5 h-5" />
                GitHub
              </button>
            </div>

            {/* Terms - Only on Register */}
            {!isLogin && (
              <p className="text-center text-sm text-gray-600">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-orange-600 hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
