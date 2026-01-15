import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { TrendingUp, TrendingDown, FileText, HardDrive, Server, Users } from 'lucide-react';
import { useCloudSpaces } from '@/hooks/useCloudSpaces';

interface Stat {
  label: string;
  value: string;
  change: string;
}

interface DashboardOverviewProps {
  stats: Stat[];
  role: 'client' | 'seller' | 'admin';
}

export default function DashboardOverview({ stats, role }: DashboardOverviewProps) {
  const { stats: cloudStats } = useCloudSpaces();

  const recentActivity = [
    { id: 1, title: role === 'client' ? 'Commande #1001' : role === 'seller' ? 'Vente #2001' : 'Nouveau utilisateur #3001', date: 'Il y a 1 jour' },
    { id: 2, title: role === 'client' ? 'Commande #1002' : role === 'seller' ? 'Vente #2002' : 'Nouveau utilisateur #3002', date: 'Il y a 2 jours' },
    { id: 3, title: role === 'client' ? 'Commande #1003' : role === 'seller' ? 'Vente #2003' : 'Nouveau utilisateur #3003', date: 'Il y a 3 jours' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">
          Vue d'ensemble
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {stat.change.includes('+') ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : stat.change.includes('-') ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : null}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cloud Spaces Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fichiers Cloud</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">{cloudStats.totalFiles}</div>
                <p className="text-sm text-muted-foreground">{cloudStats.totalFolders} dossiers</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stockage Utilisé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-3xl font-bold mb-1">{cloudStats.storageUsed}</div>
                <p className="text-sm text-muted-foreground">sur {cloudStats.storageTotal}</p>
              </div>
              <HardDrive className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
            <Progress value={cloudStats.storagePercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Serveurs Actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">12</div>
                <p className="text-sm text-muted-foreground">100% uptime</p>
              </div>
              <Server className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            {role === 'client' && 'Vos dernières commandes et services'}
            {role === 'seller' && 'Vos dernières ventes et activités'}
            {role === 'admin' && 'Activités récentes sur la plateforme'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
