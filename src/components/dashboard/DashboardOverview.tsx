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
          <Card key={i} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary/0 hover:border-l-primary">
            <CardHeader className="pb-2">
              <CardDescription className="uppercase tracking-wider text-xs font-semibold">{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold mb-1 tracking-tight">{stat.value}</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {stat.change.includes('+') ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : stat.change.includes('-') ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : null}
                <span className={stat.change.includes('+') ? "text-green-500 font-medium" : stat.change.includes('-') ? "text-red-500 font-medium" : ""}>
                  {stat.change}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infrastructure Pulse Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Infrastructure Pulse
          </h3>
          <span className="text-xs font-mono text-muted-foreground">LIVE MONITORING</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Server Card 1 */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none"></div>
            <div
              className="h-48 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000")' }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white font-bold text-lg">US-East-1 Cluster</p>
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Optimal (CPU: 24%)
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 h-8 items-end mb-1">
                    <div className="w-1 bg-primary/80 h-1/2 rounded-sm"></div>
                    <div className="w-1 bg-primary/80 h-2/3 rounded-sm"></div>
                    <div className="w-1 bg-primary h-full rounded-sm"></div>
                    <div className="w-1 bg-primary/80 h-3/4 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Server Card 2 */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none"></div>
            <div
              className="h-48 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?auto=format&fit=crop&q=80&w=2000")' }}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white font-bold text-lg">Euro-West Serveurs</p>
                  <p className="text-white/90 text-sm font-medium text-emerald-400">99.99% Uptime</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold border border-white/20">
                  ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-xl bg-card border border-border p-5 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="font-bold text-lg mb-4">Actions Rapides</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                  <a href="#">
                    <div className="bg-primary/10 p-1.5 rounded text-primary">
                      <Server className="w-4 h-4" />
                    </div>
                    Déployer Serveur
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                  <a href="#">
                    <div className="bg-primary/10 p-1.5 rounded text-primary">
                      <Users className="w-4 h-4" />
                    </div>
                    Ajouter Utilisateur
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">Système mis à jour il y a 2m</p>
            </div>
          </div>
        </div>
      </section>

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
              <FileText className="w-10 h-10 text-primary opacity-20" />
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
              <HardDrive className="w-10 h-10 text-secondary opacity-20" />
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
