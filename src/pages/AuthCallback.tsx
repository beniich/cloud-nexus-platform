import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Stocker le token
            localStorage.setItem('cnp_token', token);

            // Dans une implémentation réelle on récupérerait les infos user ici
            // Pour l'instant on simule le stockage user ou on redirige
            // AuthProvider devrait détecter le token au prochain rendu s'il est configuré pour

            toast.success('Authentification réussie !');
            navigate('/dashboard');
        } else {
            toast.error('Échec de l\'authentification');
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Finalisation de la connexion...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
