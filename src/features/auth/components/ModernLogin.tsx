import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Cloud, Github } from 'lucide-react';
import { toast } from 'sonner';

// Schémas de validation
const loginSchema = z.object({
    email: z.string().email("L'adresse email n'est pas valide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const registerSchema = loginSchema.extend({
    firstName: z.string().min(2, "Le prénom est requis"),
    lastName: z.string().min(2, "Le nom est requis"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function ModernLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    });

    const toggleMode = () => {
        setIsLogin(!isLogin);
        reset();
        setShowPassword(false);
    };

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            if (isLogin) {
                await login(data.email, data.password);
                toast.success("Connexion réussie !");
                navigate('/dashboard');
            } else {
                // S'assurer que registerUser accepte ces arguments
                await registerUser(data.email, data.password, data.firstName, data.lastName);
                toast.success("Compte créé avec succès !");
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            toast.error(isLogin ? "Échec de la connexion. Vérifiez vos identifiants." : "Échec de l'inscription.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-700 overflow-hidden backdrop-blur-sm relative">

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-3xl">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    </div>
                )}

                {/* Header */}
                <div className="p-8 pb-0 text-center">
                    <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6 transform transition-transform hover:scale-110 duration-300">
                        <Cloud className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {isLogin ? 'Bienvenue' : 'Créer un compte'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {isLogin ? 'Accédez à votre espace Cloud Nexus' : 'Rejoignez la plateforme Cloud Nexus'}
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                                        Prénom
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            {...register('firstName')}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                            placeholder="John"
                                        />
                                    </div>
                                    {errors.firstName && <p className="text-red-500 text-xs ml-1">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                                        Nom
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            {...register('lastName')}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    {errors.lastName && <p className="text-red-500 text-xs ml-1">{errors.lastName.message}</p>}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                    placeholder="nom@exemple.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Mot de passe
                                </label>
                                {isLogin && (
                                    <Link to="#" className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                                        Oublié ?
                                    </Link>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register('confirmPassword')}
                                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Traitement...
                                </>
                            ) : (
                                isLogin ? 'Se connecter' : "S'inscrire"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                                Ou continuer avec
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors group"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors group"
                        >
                            <Github className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">GitHub</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                            <button
                                onClick={toggleMode}
                                className="ml-1.5 font-bold text-orange-600 hover:text-orange-700 hover:underline transition-all"
                            >
                                {isLogin ? "S'inscrire" : "Se connecter"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
