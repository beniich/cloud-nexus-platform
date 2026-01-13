import { TabId, UserRole } from "@/types/settings";
import {
    Store,
    Palette,
    Shield,
    Bell,
    CreditCard,
} from "lucide-react";

interface TabConfig {
    id: TabId;
    label: string;
    icon: typeof Store;
    roles: UserRole[];
}

const TABS: TabConfig[] = [
    { id: "store", label: "Boutique", icon: Store, roles: ["admin", "vendor"] },
    { id: "appearance", label: "Apparence", icon: Palette, roles: ["admin", "vendor"] },
    { id: "security", label: "Sécurité", icon: Shield, roles: ["admin"] },
    { id: "notifications", label: "Notifications", icon: Bell, roles: ["admin", "vendor"] },
    { id: "payments", label: "Paiements", icon: CreditCard, roles: ["admin"] },
];

interface Props {
    activeTab: TabId;
    onChange(tab: TabId): void;
    role: UserRole;
}

export default function SettingsSidebar({ activeTab, onChange, role }: Props) {
    return (
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-fit">
            <nav className="space-y-2">
                {TABS.filter(t => t.roles.includes(role)).map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === tab.id
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
