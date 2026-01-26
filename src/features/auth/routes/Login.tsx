import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, ArrowRight, Github, Chrome, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [loginEmail, setLoginEmail] = useState('admin@hustel.com');
    const [loginPassword, setLoginPassword] = useState('password123');

    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupName, setSignupName] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        try {
            await login(loginEmail, loginPassword);
            toast.success('Bon retour parmi nous !');
            navigate('/dashboard');
        } catch (error: unknown) {
            console.error('Login error:', error);
            // toast.error is already handled in AuthContext but we could add more here
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("L'inscription est désactivée en mode démo. Utilisez les comptes prédéfinis.");
    };

    const socialLogin = (provider: string) => {
        toast.info(`Connexion via ${provider} non configurée.`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-10 group transition-transform hover:scale-105">
                    <img src="/logo.png" alt="Cloud Nexus" className="h-20 w-auto" />
                </Link>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl mb-6">
                        <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Connexion</TabsTrigger>
                        <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Inscription</TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl">Bon retour</CardTitle>
                                <CardDescription>
                                    Accédez à votre infrastructure Cloud
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                                            onClick={() => socialLogin('Google')}
                                        >
                                            <Chrome className="w-4 h-4 mr-2 text-blue-500" />
                                            Google
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                                            onClick={() => socialLogin('GitHub')}
                                        >
                                            <Github className="w-4 h-4 mr-2" />
                                            GitHub
                                        </Button>
                                    </div>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">
                                                OU PAR EMAIL
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email professionnel</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                className="pl-10 h-11 bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
                                                placeholder="nom@entreprise.com"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="login-password">Mot de passe</Label>
                                            <Link to="/reset-password" title="password123" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                                Oublié ?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                className="pl-10 h-11 bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] font-bold" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Authentification...
                                            </>
                                        ) : (
                                            <>
                                                Se connecter
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl w-full text-[11px] text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                                        <span className="font-bold">Démo Rapide:</span> admin@hustel.com / password123
                                    </div>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Signup Tab */}
                    <TabsContent value="signup">
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Créer un compte</CardTitle>
                                <CardDescription>
                                    Rejoignez la plateforme Cloud Nexus
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSignup}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">Nom complet</Label>
                                        <Input
                                            id="signup-name"
                                            placeholder="John Doe"
                                            className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="votre@email.com"
                                            className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Mot de passe</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" variant="accent" className="w-full h-12 font-bold" disabled>
                                        Créer mon compte
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="text-center text-sm text-slate-500 mt-8">
                    <Link to="/" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1 font-semibold">
                        ← Retour au portail public
                    </Link>
                </p>
            </div>
        </div>
    );
}
