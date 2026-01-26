import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { useDashboard } from '@/contexts/DashboardContext';
import { UserRole } from '@/config/dashboardConfig';

export const DashboardHeader = () => {
    const { t } = useTranslation();
    const { currentRole, setCurrentRole } = useDashboard();

    return (
        <header className="h-16 flex items-center justify-between px-6 mb-2">
            <div className="flex items-center gap-4">
                {/* Reserved for future breadcrumbs or title */}
            </div>

            {/* Role Selector */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="font-medium text-gray-500 uppercase text-xs tracking-wider">
                    {t('dashboard.mode')}:
                </span>
                <Select
                    value={currentRole}
                    onValueChange={(v: UserRole) => setCurrentRole(v)}
                >
                    <SelectTrigger className="w-[110px] h-8 border-none bg-transparent focus:ring-0 font-semibold text-primary">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="seller">Vendeur</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </header>
    );
};
