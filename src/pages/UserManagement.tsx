import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, UserPlus, Trash2, Crown } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export default function UserManagement() {
    const queryClient = useQueryClient();
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState('client');

    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await fetch('http://localhost:3000/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        }
    });

    // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: async (userData: { email: string; name: string; role: string }) => {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Failed to create user');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Utilisateur créé avec succès');
            setNewUserEmail('');
            setNewUserName('');
            setNewUserRole('client');
        },
        onError: () => {
            toast.error('Erreur lors de la création de l\'utilisateur');
        }
    });

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const response = await fetch(`http://localhost:3000/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role })
            });
            if (!response.ok) throw new Error('Failed to update role');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Rôle mis à jour');
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour du rôle');
        }
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete user');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Utilisateur supprimé');
        },
        onError: () => {
            toast.error('Erreur lors de la suppression');
        }
    });

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserEmail || !newUserName) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        createUserMutation.mutate({
            email: newUserEmail,
            name: newUserName,
            role: newUserRole
        });
    };

    const getRoleBadge = (role: string) => {
        const variants: Record<string, { variant: any; icon: any }> = {
            owner: { variant: 'default', icon: Crown },
            admin: { variant: 'secondary', icon: Shield },
            seller: { variant: 'outline', icon: null },
            client: { variant: 'outline', icon: null }
        };
        const config = variants[role] || variants.client;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="gap-1">
                {Icon && <Icon className="w-3 h-3" />}
                {role.toUpperCase()}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Navbar />
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">Créez et gérez les comptes utilisateurs et leurs permissions</p>
                </div>

                {/* Create User Form */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Créer un nouvel utilisateur
                        </CardTitle>
                        <CardDescription>Ajoutez un utilisateur avec un rôle spécifique</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Jean Dupont"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rôle</Label>
                                <Select value={newUserRole} onValueChange={setNewUserRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client">Client</SelectItem>
                                        <SelectItem value="seller">Vendeur</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="owner">Super Admin (Owner)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Créer
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des utilisateurs</CardTitle>
                        <CardDescription>{users.length} utilisateur(s) enregistré(s)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-center py-8 text-muted-foreground">Chargement...</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead>Date de création</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: User) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                                                >
                                                    <SelectTrigger className="w-[140px] inline-flex">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="client">Client</SelectItem>
                                                        <SelectItem value="seller">Vendeur</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="owner">Owner</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm(`Supprimer ${user.name} ?`)) {
                                                            deleteUserMutation.mutate(user.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
