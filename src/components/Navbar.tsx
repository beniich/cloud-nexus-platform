import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 group-hover:opacity-80 transition-opacity" />
            <span className="font-display font-bold text-xl">Cloud Industrie</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t('navbar.home')}
            </Link>
            <Link to="/services" className="text-foreground hover:text-primary transition-colors">
              {t('common.services')}
            </Link>
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors">
              {t('common.shop')}
            </Link>
            <Link to="/cart" className="text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link to="/cms" className="text-foreground hover:text-primary transition-colors font-medium">
              CMS
            </Link>
            <Link to="/hosting" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('hosting.title')}
            </Link>
            <Link to="/request-service" className="text-foreground hover:text-primary transition-colors font-medium">
              Offre Sur Mesure
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher - NEW COMPONENT */}
            <LanguageSwitcher />

            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                {t('common.login')}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="accent" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border animate-fade-in">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/services"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.services')}
            </Link>
            <Link
              to="/shop"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.shop')}
            </Link>
            <Link
              to="/cart"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('common.cart')}
            </Link>
            <Link
              to="/request-service"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Offre Sur Mesure
            </Link>
            <Link
              to="/cms"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              CMS
            </Link>
            <Link
              to="/hosting"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Hébergement
            </Link>
            <div className="pt-4 space-y-2">
              {/* Mobile Language Switcher */}
              <div className="flex justify-center mb-4">
                <LanguageSwitcher />
              </div>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">
                  {t('common.login')}
                </Button>
              </Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="accent" size="sm" className="w-full">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
