import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@/application/auth/JwtAuthGuard';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getAllUsers(@Request() req) {
        // Only owners can see all users
        if (req.user.role !== 'owner') {
            throw new Error('Unauthorized');
        }

        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return users;
    }

    @Post()
    async createUser(@Request() req, @Body() createUserDto: { email: string; name: string; role: string }) {
        // Only owners can create users
        if (req.user.role !== 'owner') {
            throw new Error('Unauthorized');
        }

        // Generate a random temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                name: createUserDto.name,
                role: createUserDto.role || 'client',
                passwordHash: passwordHash,
            },
        });

        return {
            ...user,
            temporaryPassword: tempPassword, // Return temp password to frontend
        };
    }

    @Patch(':id/role')
    async updateUserRole(
        @Request() req,
        @Param('id') id: string,
        @Body() updateRoleDto: { role: string }
    ) {
        // Only owners can update roles
        if (req.user.role !== 'owner') {
            throw new Error('Unauthorized');
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: { role: updateRoleDto.role },
        });

        return user;
    }

    @Delete(':id')
    async deleteUser(@Request() req, @Param('id') id: string) {
        // Only owners can delete users
        if (req.user.role !== 'owner') {
            throw new Error('Unauthorized');
        }

        // Prevent deleting yourself
        if (req.user.id === id) {
            throw new Error('Cannot delete your own account');
        }

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'User deleted successfully' };
    }
}
