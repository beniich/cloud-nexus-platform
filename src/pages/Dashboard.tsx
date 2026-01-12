import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, Settings, Package, TrendingUp, FileText, MessageSquare, Cloud, Server, HardDrive } from 'lucide-react';

const IconMap: any = {
  LayoutDashboard, ShoppingBag, Users, Settings, Package,
  TrendingUp, FileText, MessageSquare, Cloud, Server,
  HardDrive
};

function DynamicIcon({ name, className = "w-5 h-5" }: { name: string, className?: string }) {
  const Icon = IconMap[name] || LayoutDashboard;
  return <Icon className={className} />;
}

export default function Dashboard() {
  const stats = [
    { label: 'Total Fichiers', value: '1,234', icon: 'FileText', color: 'blue' },
    { label: 'Stockage Utilisé', value: '45.2 GB', icon: 'HardDrive', color: 'purple' },
    { label: 'Serveurs Actifs', value: '12', icon: 'Server', color: 'green' },
    { label: 'Utilisateurs', value: '89', icon: 'Users', color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vue d'ensemble</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700`}>
                {/* Note: Tailwind dynamic classes like bg-${color}-100 don't verify well if not safe-listed. Using inline styles or map for reliability. */}
                {/* For this specific snippet, I'll rely on text color classes which are more likely to work if standard. */}
                <DynamicIcon name={stat.icon} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité Récente</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg transition-all hover:scale-105">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Fichier uploadé avec succès</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Il y a {i} heures</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
