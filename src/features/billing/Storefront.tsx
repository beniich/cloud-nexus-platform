import React from 'react';

export default function Storefront() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#1c130d] dark:text-white transition-colors duration-200 font-display min-h-screen pb-24">
            {/* Top Sticky Header */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">cloud_done</span>
                        <h1 className="text-xl font-bold tracking-tight">Cloud Nexus</h1>
                    </div>
                    <div className="relative">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                        </button>
                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background-light dark:border-background-dark">
                            3
                        </span>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Banner Section */}
                <div className="px-4 pt-4">
                    <div className="relative overflow-hidden rounded-xl bg-[#1c130d] min-h-[220px] flex flex-col justify-center px-6 py-8 shadow-xl group">
                        {/* Background Image */}
                        <div className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcMRvePkUeJ86cbD1cd7Lyr_FkWi0re6LSlwz_5kFzwoWoDQ8zLgsCVIEf0Pk2iXbi9M-CgACTnfx3RXfK9rYM4AhmwojlPviDXOHGe7o0R9I-s0vZ4cJhnNMHsjfdRLHYS0irAEeYXryjwI1Ii8wZxHDpIdO0BWOd7-dxDD2a2887e0KXot9OgMbT37AD0f1mv2ipcsLFzjiVZShzktQMw-19daIfUd0ZsUdHSp4JcEtgoY8QsRRz8KVDI8bZ_Mnyx0yH54aB7KVK')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

                        <div className="relative z-10">
                            <span className="inline-block px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded mb-3">Featured Deal</span>
                            <h2 className="text-white text-3xl font-bold leading-tight mb-2">Scale Your <br />Infrastructure</h2>
                            <p className="text-gray-300 text-sm mb-5 max-w-[200px]">Get 20% off on all Cloud Server Pro instances today.</p>
                            <button className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg text-sm transition-transform active:scale-95 shadow-lg shadow-primary/30 hover:bg-orange-600">
                                Shop Now
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between px-4 mb-3">
                        <h3 className="text-lg font-bold">Categories</h3>
                        <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
                        <CategoryPill label="All" active />
                        <CategoryPill label="Cloud Services" icon="cloud" />
                        <CategoryPill label="Server Gear" icon="dns" />
                        <CategoryPill label="Support" icon="support_agent" />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="mt-8 px-4">
                    <h3 class="text-lg font-bold mb-4">Popular Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProductCard
                            title="Nexus Server Rack V2"
                            price="$1,299"
                            rating={4.8}
                            reviews={124}
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCfDmS5tAeS2rhtrPDV56KocGDKnE27QndASfOpJO_NU1JrHWkJh81vnqhPLgvqB4aHo_xj0cOe391lbjyYiOscDwcvYvX86_qzEPoM_9IWabFkgv0QKMMWdScm-xO451GUZ6AUenloA9bA1VRdyh3XUj6CK1QegVINx5FkqR6mTLRvMKFvniT9frGxvnp6MqfWfP7SvYHd4R8Cn45-yOA_8O15lPbdXisluB3qPu-Uc-0-3SIl03gkXjRr20dpvMWPE69Wg7079fvZ"
                        />
                        <ProductCard
                            title="Managed DB Instance"
                            price="$49"
                            period="/monthly"
                            rating={4.5}
                            reviews={89}
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDjr1ZdfISEWo3OnYiO4B4f8j7gGGORzXY4TxtrI8IlSXA0Iqw2sZofSWK2zTsOpI0-46cWKuirOuXTWbi44sg2_G-KQzQ-ehY3n9Lhwfy5lHdBGBh6iZlqC83PQ2_gLT_Zs7hV_vLUwlPFfdJKNt5GEqzk1aHo6iVbcxq1ZOSh0frwjf9WOMoqbidahTh06_CtdTrpYE2Qm3l3WKlaYLxVPf661lpFETvnAnouhquJ7-DQoYylWZ2rCRBtZA22S-I637PHXE0PDDUb"
                            isFavorite
                        />
                        <ProductCard
                            title="24/7 Priority Support"
                            price="$199"
                            period="/yearly"
                            rating={5.0}
                            reviews={42}
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCE0f_87-Hir5XmjYFj4u5hTtbnYUojNdbx_IJz6hgNlj72Dvt8UnS2B8ThDF8JdHqfX0j9DX1YBYL0Erlg4u4YHl5Wh71AruMOVrlR7_ziIn5ExQPUfYGkkyz1UlH5z-iBmI2K2GVPfMIYW2XNixjHjXh4iVjRa9C_vwIkB3dkTVXYEsqwTKr51r-4_RTofajq8Weg43M85OCxuWT46gnFy1MIlKcs0jMUaTlhI6EAKh0nLi8r-PULx88jXvIw2WZnksTr61uN2hO4"
                        />
                        <ProductCard
                            title="Fiber Network Hub"
                            price="$549"
                            rating={4.9}
                            reviews={215}
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAHjz1FtcF4S-UC0ZCRx9bo2xYNwBiwnopA5_dR64OjlL10_z55WnOwHdG33CD1YLbWe-26kq6R1ZplavhGckEPuhj_8doxOVCdKDnfGbF2VMTjqc083sBCiFdObVDBBD5jWsWz4ugjsSkqTke4o_8H7uFovb1vvX4aLSxv7aJYfpnSbVvSl36qu-5Rz215R9a3LYX7xmEdPkXIx559WWQ7HTPTYViyxS4yKQa9LQ0hU_bny6gM66CfwrFFJb5mKRSHs5cCQD3g8r44"
                        />
                    </div>
                </div>
            </main>

            {/* Bottom Navigation Bar (iOS Style) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-center z-50">
                <NavButton icon="home" label="Home" active />
                <NavButton icon="search" label="Search" />
                <NavButton icon="local_shipping" label="Orders" />
                <NavButton icon="person" label="Profile" />
            </nav>
        </div>
    );
}

function CategoryPill({ label, icon, active }: { label: string, icon?: string, active?: boolean }) {
    return (
        <div className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 border transition-all cursor-pointer
      ${active
                ? 'bg-primary shadow-md shadow-primary/20 border-transparent text-white'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-[#1c130d] dark:text-gray-200'
            }`}>
            {icon && <span className="material-symbols-outlined text-primary text-lg">{icon}</span>}
            <p className="text-sm font-medium">{label}</p>
        </div>
    );
}

function ProductCard({ title, price, period, rating, reviews, image, isFavorite }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col group hover:shadow-lg transition-all">
            <div className="relative h-40 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={image} alt={title} />
                <button className={`absolute top-2 right-2 p-1.5 backdrop-blur rounded-full transition-colors ${isFavorite ? 'bg-white/80 dark:bg-black/40 text-primary' : 'bg-white/80 dark:bg-black/40 text-gray-400 hover:text-red-500'}`}>
                    <span className={`material-symbols-outlined text-lg ${isFavorite ? 'filled-icon' : ''}`}>favorite</span>
                </button>
            </div>
            <div className="p-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-yellow-400 text-xs filled-icon">star</span>
                    <span className="text-[10px] font-bold text-gray-500">{rating} ({reviews})</span>
                </div>
                <h4 className="text-sm font-bold line-clamp-2 leading-tight mb-2 text-[#1c130d] dark:text-white">{title}</h4>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-primary font-bold text-lg leading-none">{price}</span>
                        {period && <span className="text-[10px] text-gray-400">{period}</span>}
                    </div>
                    <button className="bg-primary text-white h-8 w-8 rounded-lg flex items-center justify-center shadow-md shadow-primary/20 transition-transform active:scale-90 hover:bg-orange-600">
                        <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function NavButton({ icon, label, active }: { icon: string, label: string, active?: boolean }) {
    return (
        <button className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
            <span className={`material-symbols-outlined ${active ? 'filled-icon' : ''}`}>{icon}</span>
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );
}
