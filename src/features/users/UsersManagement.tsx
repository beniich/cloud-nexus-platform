import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { toast } from 'sonner';
import { Shield, UserPlus, Trash2, Crown } from 'lucide-react';

const INITIAL_USERS = [
    { id: 'user-001', name: 'Admin User', email: 'admin@example.com', role: 'owner', createdAt: '2024-01-01' },
    { id: 'user-002', name: 'John Doe', email: 'john@example.com', role: 'client', createdAt: '2024-02-15' },
];

export default function UsersManagement() {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'client' });

    const handleCreateUser = (e) => {
        e.preventDefault();
        const user = { ...newUser, id: `user-${Date.now()}`, createdAt: new Date().toISOString() };
        setUsers([...users, user]);
        setNewUser({ name: '', email: '', role: 'client' });
        toast.success('Utilisateur créé');
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
        toast.success('Utilisateur supprimé');
    };

    const getRoleBadge = (role) => {
        const variants = {
            owner: { variant: 'default', icon: Crown },
            admin: { variant: 'secondary', icon: Shield },
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

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6 max-w-6xl space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Gestion des Utilisateurs</h1>
                <p className="text-muted-foreground">Créez et gérez les comptes utilisateurs.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Créer un nouvel utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input id="name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rôle</Label>
                            <Select value={newUser.role} onValueChange={role => setNewUser({ ...newUser, role })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" className="w-full">Créer</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des utilisateurs</CardTitle>
                    <Input placeholder="Rechercher..." className="max-w-sm mt-2" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Créé le</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
