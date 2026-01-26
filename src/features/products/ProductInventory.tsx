import React, { useState } from 'react';
import { toast } from 'sonner';

export default function ProductInventory() {
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Product Inventory</h2>
                    <div className="flex size-10 items-center justify-end">
                        <button className="flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="px-4 py-2">
                    <label className="flex flex-col min-w-40 h-11 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                            <div className="text-slate-400 dark:text-[#cca78e] flex border-none bg-white dark:bg-[#4a3121] items-center justify-center pl-4 rounded-l-xl border-r-0">
                                <span className="material-symbols-outlined text-lg">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-white dark:bg-[#4a3121] focus:border-none h-full placeholder:text-slate-400 dark:placeholder:text-[#cca78e] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal"
                                placeholder="Search by name or SKU"
                                defaultValue=""
                            />
                        </div>
                    </label>
                </div>
                {/* Category Filter Chips */}
                <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide">
                    <FilterChip label="All" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                    <FilterChip label="Hardware" active={activeFilter === 'Hardware'} onClick={() => setActiveFilter('Hardware')} />
                    <FilterChip label="Software" active={activeFilter === 'Software'} onClick={() => setActiveFilter('Software')} />
                    <FilterChip label="Licenses" active={activeFilter === 'Licenses'} onClick={() => setActiveFilter('Licenses')} />
                </div>
            </header>

            {/* Product List */}
            <main className="flex flex-col gap-px bg-slate-200 dark:bg-white/5 pb-24">
                <ProductItem
                    name="Nexus Pro Router"
                    price="$299.00"
                    sku="NX-400"
                    stock={12}
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuCeVQHIr-HSAlRFqfBsHtSJSXeKS4i3JQfiIA8Eya2O2an0VAebwyDP8VKSDmS6BJ7_1ktMH8MYk1SWSdb1_w4yEE4Xmz5u0Cmd-frzzuhzXI3OCglIUQro6vyeIWXeJD3lxEqw5MVm9-Dn7vn0Vb3zbDmjkYnlkjynhXjgp3DvTf7Oi1F3F1Yx26W_WiYYKdtLCfFkA6gBrIv26CYo9kAVB68ccyFnKLD_HIOwokmmIXY0wMKnFlzxzb2oyZydphqzWcsG8lfxN2Us"
                />
                <ProductItem
                    name="Cloud Security Suite"
                    price="$150.00"
                    sku="SW-SEC-1"
                    lowStock
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuBtjcDGBY51BSpzGM3WTfeVM-_xuk5fKivDfIh7l4X827arFa8Eju00_25uSgqcGjVlbZdapF_KxffU0Hcq2BS18cNVcD0pLQIVWfa9Cxio78ztmuCsWbT0kfvk3Tb4dY7n9ESnWHF8wm5L6IYqYzpK-LuEkQDPLijptDU03IFZ1W8j8RQTxJU8zXDbl6vQHFyKZ0KfQebbKBTpTXesB6YtWkj9NdnG-8-N257lSX6ntl1e4wDSc1GrguYFMuqcKeSrlhxzbGxX8zdI"
                />
                <ProductItem
                    name="Mesh Node X3"
                    price="$89.99"
                    sku="HW-MSH-X"
                    stock={45}
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuCG27ZI6AcLCWjevWDkQ4Q0REFplf7RphrfKMPZUrLenuYMMOz7hrRv1hvs7YQmBhX0gTKKUsgfBu2ge-309F8gVOv7M1tsM1iPaAe4iuI7-9ZOoy0hoYYiuLfNSPlCFKbtaZLaOBxModym6GWM2Ehasaas3zBv6zCchLtBd2oAVyk8hWcdmgDGqV9lkSn0gitmKnzekCnAiPiM13ZDd830Y2E0xLPlX7IDVKuZU1c4HiuFkAbf6YVQQfzd8ShyhebGijOhNI6Bz664"
                />
                <ProductItem
                    name="Enterprise API License"
                    price="$1,200.00"
                    sku="LIC-ENT-5"
                    stock={3}
                    lowStock
                    isLicense
                    image="https://lh3.googleusercontent.com/aida-public/AB6AXuDNzd_5DW5djgWrElbYcsjPQR_-UnZ6Nme8jEzjtvaZ1d6lxp_C0-ms9sO5jV5IWeTYKm4GIyS1NblfG5FO5f6jaosCJcl9blZkJ6yzdNqfEMUGc4ci-lYlbzZ016A-5XEaHbqc6KZD3sAow9EYmLEMRB5C7MI4TZ0LOCci0dbNG8DdWnw0lQ1vDoQs3pk7Ohr9M1sVZfp353qCixQOyrpMw_up4k-JVsDImRo8BSaEAYDjtherbremhsRkhkdgrG0xq1EOKJdq7uZH"
                />
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6">
                <button className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40 active:scale-95 transition-transform hover:bg-orange-600">
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            </div>

            {/* iOS Bottom Home Indicator (Visual) */}
            <div className="fixed bottom-0 left-0 w-full h-8 flex justify-center items-end pb-2 pointer-events-none">
                <div className="w-32 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full"></div>
            </div>
        </div>
    );
}

function FilterChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 cursor-pointer transition-all
      ${active
                    ? 'bg-primary shadow-md shadow-primary/20 text-white'
                    : 'bg-white dark:bg-[#4a3121] border border-slate-200 dark:border-transparent text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-[#5c3d2a]'
                }`}
        >
            <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
        </div>
    );
}

interface ProductItemProps {
    name: string;
    price: string;
    sku: string;
    stock: number;
    lowStock?: boolean;
    image: string;
    isLicense?: boolean;
}

function ProductItem({ name, price, sku, stock, lowStock, image, isLicense }: ProductItemProps) {
    const handleView = () => {
        // Placeholder for navigation
        toast.info(`Vue détail du produit: ${sku}`);
    };

    const handleEdit = () => {
        // Placeholder for edit modal
        toast.info(`Modification du produit: ${name}`);
    };

    const handleMenu = () => {
        toast.info("Menu d'actions ouvert");
    };

    return (
        <div className="flex flex-col gap-3 bg-white dark:bg-card px-4 py-4 border-b border-border/50 first:rounded-t-none last:rounded-b-none md:rounded-xl md:border md:mb-4">
            <div className="flex items-start gap-4">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-20 shadow-sm shrink-0 border border-border"
                    style={{ backgroundImage: `url("${image}")` }}
                ></div>
                <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex justify-between items-start">
                        <p className="text-foreground text-base font-bold leading-tight truncate">{name}</p>
                        <p className="text-foreground text-base font-bold">{price}</p>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">SKU: {sku}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className={`size-2 rounded-full ${lowStock ? 'bg-red-500 animate-pulse' : (isLicense && stock < 5 ? 'bg-orange-500' : 'bg-emerald-500')}`}></div>
                        <p className={`text-xs font-bold uppercase tracking-wide ${lowStock ? 'text-red-600 dark:text-red-400' : (isLicense && stock < 5 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400')}`}>
                            {lowStock ? 'Faible stock' : (isLicense ? `${stock} restants` : `${stock} en stock`)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons Row matching screenshot */}
            <div className="flex items-center gap-2 mt-2">
                <button
                    onClick={handleView}
                    className="flex-1 h-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    Voir
                </button>

                <button
                    onClick={handleEdit}
                    className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Modifier
                </button>

                <button
                    onClick={handleMenu}
                    className="size-10 shrink-0 bg-secondary/10 hover:bg-secondary/20 text-foreground rounded-lg flex items-center justify-center transition-colors"
                >
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
        </div>
    );
}
