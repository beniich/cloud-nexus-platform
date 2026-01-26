import React, { useState } from 'react';

type UserRole = 'ALL' | 'ADMIN' | 'SELLER' | 'CLIENT' | 'VENDOR';

export default function UserManagement() {
    const [activeFilter, setActiveFilter] = useState<UserRole>('ALL');

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 flex flex-col p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between max-w-3xl mx-auto w-full mb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back_ios</span>
                    <h1 className="text-xl font-bold tracking-tight">User Management</h1>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>

            <main className="max-w-3xl mx-auto w-full pb-24 flex-1">
                {/* Segmented Control Filter */}
                <div className="py-4">
                    <div className="flex flex-wrap gap-2 md:gap-0 md:h-11 items-center justify-center rounded-xl bg-slate-200 dark:bg-white/5 p-1">
                        <FilterButton label="All" value="ALL" active={activeFilter === 'ALL'} onClick={() => setActiveFilter('ALL')} />
                        <FilterButton label="Admin" value="ADMIN" active={activeFilter === 'ADMIN'} onClick={() => setActiveFilter('ADMIN')} />
                        <FilterButton label="Seller" value="SELLER" active={activeFilter === 'SELLER'} onClick={() => setActiveFilter('SELLER')} />
                        <FilterButton label="Client" value="CLIENT" active={activeFilter === 'CLIENT'} onClick={() => setActiveFilter('CLIENT')} />
                        <FilterButton label="Vendor" value="VENDOR" active={activeFilter === 'VENDOR'} onClick={() => setActiveFilter('VENDOR')} />
                    </div>
                </div>

                {/* User List */}
                <div className="space-y-4 px-2">
                    <UserCard
                        name="Alex Rivera"
                        role="ADMIN"
                        email="alex@nexus.com"
                        avatarBg="f97015"
                        roleColor="text-primary bg-primary/20"
                        status="online"
                    />
                    <UserCard
                        name="Sarah Chen"
                        role="SELLER"
                        email="sarah.chen@nexus.com"
                        avatarBg="10b981"
                        roleColor="text-emerald-500 bg-emerald-500/20"
                        status="online"
                    />
                    <UserCard
                        name="Marcus Johnson"
                        role="CLIENT"
                        email="m.johnson@client.io"
                        avatarBg="3b82f6"
                        roleColor="text-blue-500 bg-blue-500/20"
                        status="offline"
                    />
                    <UserCard
                        name="Elena Rodriguez"
                        role="VENDOR"
                        email="elena@vendorhub.com"
                        avatarBg="f59e0b"
                        roleColor="text-amber-500 bg-amber-500/20"
                        status="online"
                    />
                </div>
            </main>

            {/* Floating Action Button */}
            <button className="fixed bottom-6 right-6 h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 active:scale-95 transition-transform z-20 hover:bg-orange-600">
                <span className="material-symbols-outlined text-3xl">person_add</span>
            </button>
        </div>
    );
}

function FilterButton({ label, value, active, onClick }: { label: string, value: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 min-w-[80px] h-9 md:h-full rounded-lg px-2 text-xs font-semibold uppercase tracking-wider transition-all
            ${active
                    ? 'bg-white dark:bg-primary shadow-sm text-primary dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            {label}
        </button>
    );
}

function UserCard({ name, role, email, avatarBg, roleColor, status }: any) {
    return (
        <div className="bg-white dark:bg-white/5 rounded-xl p-4 transition-all border border-transparent hover:border-primary/20 shadow-sm md:flex md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                    <div className={`aspect-square rounded-full h-14 w-14 border-2 border-primary/20 flex items-center justify-center bg-[#${avatarBg}]/10 text-xl font-bold text-slate-700 dark:text-white overflow-hidden`}>
                        {name.charAt(0)}
                        {/* Placeholder for avatar image */}
                        {/* <img src="..." className="w-full h-full object-cover" /> */}
                    </div>
                    <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-white dark:border-background-dark ${status === 'online' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-bold truncate text-slate-900 dark:text-white">{name}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${roleColor}`}>{role}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{email}</p>
                </div>
            </div>

            <div className="mt-4 md:mt-0 flex gap-2 md:w-auto w-full">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 h-10 px-4 rounded-lg text-sm font-semibold transition-colors text-slate-700 dark:text-white">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 h-10 px-4 rounded-lg text-sm font-semibold transition-colors text-primary">
                    <span className="material-symbols-outlined text-sm">lock_person</span>
                    Permissions
                </button>
            </div>
        </div>
    );
}
