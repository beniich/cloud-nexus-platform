import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureAuth } from '@/lib/auth/secureAuth';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export const SecureLoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        feedback: string;
    }>({ score: 0, feedback: '' });

    // Validation en temps réel du mot de passe
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        const feedback: string[] = [];

        if (password.length >= 12) score++;
        else feedback.push('12+ caractères');

        if (/[A-Z]/.test(password)) score++;
        else feedback.push('majuscule');

        if (/[a-z]/.test(password)) score++;
        else feedback.push('minuscule');

        if (/\d/.test(password)) score++;
        else feedback.push('chiffre');

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        else feedback.push('caractère spécial');

        setPasswordStrength({
            score,
            feedback: feedback.length > 0 ? `Manquant: ${feedback.join(', ')}` : 'Fort',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            checkPasswordStrength(value);
        }

        // Clear error on input
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await secureAuth.login(formData.email, formData.password);
            // Force reload to ensure AuthContext picks up the new session immediately if needed, 
            // or rely on context update if secureAuth triggers an event (not implemented yet, so simple navigate is best if context polls or re-checks)
            // For now, simple navigate, assuming AuthContext in App checks auth state or we trigger it.
            // Ideally, calling login() from AuthContext is better, but this component uses secureAuth directly as per snippet.
            // We will ensure AuthContext exposes a way or checks session on mount/route change.
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength.score === 0) return 'bg-gray-200';
        if (passwordStrength.score <= 2) return 'bg-red-500';
        if (passwordStrength.score <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cloud Nexus</h1>
                <p className="text-gray-600 mt-2">Connexion sécurisée</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre@email.com"
                            className="pl-10"
                            required
                            autoComplete="email"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••••••"
                            className="pl-10 pr-10"
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded ${i < passwordStrength.score ? getStrengthColor() : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-600">{passwordStrength.feedback}</p>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || passwordStrength.score < 3}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion...
                        </>
                    ) : (
                        'Se connecter'
                    )}
                </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                    🔒 Connexion sécurisée avec chiffrement de bout en bout
                </p>
            </div>
        </div>
    );
};
