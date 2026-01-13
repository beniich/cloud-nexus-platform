import { ReactNode } from "react";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGuard({
    allow,
    children,
}: {
    allow: UserRole[];
    children: ReactNode;
}) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (!user || !allow.includes(user.role)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Accès Interdit</h2>
                <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                <p className="text-sm text-gray-400 mt-4">Role actuel: {user?.role || 'Non connecté'}</p>
            </div>
        );
    }

    return <>{children}</>;
}
