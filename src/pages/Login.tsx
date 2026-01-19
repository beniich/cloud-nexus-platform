import React, { useState } from 'react';
import { Cloud, Mail, Lock, User, Eye, EyeOff, Github, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    const baseUrl = apiUrl.replace('/api', '');
    window.location.href = `${baseUrl}/auth/google`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (formData.email && formData.password) {
        toast.success(t('auth.success.login', 'Connexion réussie !'));
        navigate('/dashboard');
      } else {
        toast.error(t('auth.errors.fill_all', 'Veuillez remplir tous les champs'));
      }
    } else {
      if (formData.email && formData.password && formData.firstName && formData.lastName) {
        if (formData.password !== formData.confirmPassword) {
          toast.error(t('auth.errors.password_mismatch', 'Les mots de passe ne correspondent pas'));
          return;
        }
        toast.success(t('auth.success.signup', 'Compte créé avec succès !'));
        navigate('/dashboard');
      } else {
        toast.error(t('auth.errors.fill_all', 'Veuillez remplir tous les champs'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-stone-100 flex items-center justify-center p-6">
      {/* Logo Header */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
            <Cloud className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Cloud Industrie</span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-xl">
        {/* Welcome Message - Only on Login */}
        {isLogin && (
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('auth.welcome_title', 'Welcome')}</h1>
            <p className="text-gray-600 text-lg">{t('auth.welcome_subtitle', 'Sign in or create an account')}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.auth_title', 'Authentication')}</h2>
            <p className="text-gray-600">{t('auth.auth_subtitle', 'Access your Cloud Industrie space')}</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 p-2 bg-gray-100 rounded-full mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${isLogin
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {t('auth.login.tab', 'Sign In')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-full font-medium transition-all ${!isLogin
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {t('auth.signup.tab', 'Sign Up')}
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Registration Fields */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-medium mb-2">{t('auth.fields.first_name', 'First Name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={t('auth.fields.placeholder_first_name', 'John')}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-900 font-medium mb-2">{t('auth.fields.last_name', 'Last Name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t('auth.fields.placeholder_last_name', 'Doe')}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">{t('auth.fields.email', 'Email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.fields.placeholder_email', 'your@email.com')}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">{t('auth.fields.password', 'Password')}</label>
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
                <label className="block text-gray-900 font-medium mb-2">{t('auth.fields.confirm_password', 'Confirm Password')}</label>
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
                  {t('auth.login.forgot_password', 'Forgot password?')}
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-orange-400/30 transition-all transform hover:scale-[1.02]"
            >
              {isLogin ? t('auth.login.submit', 'Sign In') : t('auth.signup.submit', 'Create Account')}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600 font-medium">{t('auth.or_continue', 'OR CONTINUE WITH')}</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700"
              >
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
                {t('auth.terms.prefix', 'By creating an account, you agree to our')}{' '}
                <a href="#" className="text-orange-600 hover:underline font-medium">
                  {t('auth.terms.service', 'Terms of Service')}
                </a>{' '}
                {t('auth.terms.and', 'and')}{' '}
                <a href="#" className="text-orange-600 hover:underline font-medium">
                  {t('auth.terms.privacy', 'Privacy Policy')}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← {t('auth.back_home', 'Back to home')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
