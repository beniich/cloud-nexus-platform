import React from 'react';
import { Cloud, Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const quickLinks = [
    { icon: <Home />, label: 'Homepage', href: '/' },
    { icon: <Cloud />, label: 'Services', href: '/services' },
    { icon: <Search />, label: 'Documentation', href: '/docs' },
    { icon: <HelpCircle />, label: 'Support', href: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-stone-100 flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo size="xl" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[180px] font-bold leading-none bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved or deleted, or you may have mistyped the URL.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg mb-12 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search our site..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-orange-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center mb-4 mx-auto text-white group-hover:scale-110 transition-transform shadow-md">
                {link.icon}
              </div>
              <p className="font-semibold text-gray-900">{link.label}</p>
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-xl hover:shadow-orange-400/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-semibold text-lg"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <a
            href="/contact"
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg"
          >
            Contact Support
          </a>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
          <p className="text-gray-700 font-medium mb-2">
            Need help finding something?
          </p>
          <p className="text-gray-600 text-sm">
            Check our{' '}
            <a href="/docs" className="text-orange-600 hover:underline font-semibold">
              documentation
            </a>{' '}
            or{' '}
            <a href="/contact" className="text-orange-600 hover:underline font-semibold">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
