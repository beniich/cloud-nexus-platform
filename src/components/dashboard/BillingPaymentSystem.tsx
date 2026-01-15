import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, Download, Eye, CheckCircle, Clock, AlertCircle, Filter, Search, Calendar, Plus, X, LucideIcon } from 'lucide-react';

interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
}

interface Invoice {
    id: string;
    customer: string;
    email: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'draft';
    items: InvoiceItem[];
}

interface PaymentMethod {
    id: number;
    type: string;
    last4?: string;
    expiry?: string;
    email?: string;
    default: boolean;
}

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    status: 'completed' | 'refunded';
    method: string;
}

interface Stat {
    label: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: string;
}

const BillingPaymentSystem = () => {
    const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'transactions'>('invoices');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const stats: Stat[] = [
        { label: 'Revenus ce mois', value: '€48,524', change: '+23%', icon: DollarSign, color: 'blue' },
        { label: 'Factures payées', value: '142', change: '+8%', icon: CheckCircle, color: 'green' },
        { label: 'En attente', value: '12', change: '-15%', icon: Clock, color: 'orange' },
        { label: 'En retard', value: '3', change: '+1', icon: AlertCircle, color: 'red' }
    ];

    const invoices: Invoice[] = [
        {
            id: 'INV-2024-001',
            customer: 'TechCorp SA',
            email: 'contact@techcorp.fr',
            date: '2024-01-12',
            dueDate: '2024-02-12',
            amount: 1249.99,
            status: 'paid',
            items: [
                { description: 'VPS Pro - Mensuel', quantity: 3, price: 29.99 },
                { description: 'Cloud Storage 500GB', quantity: 2, price: 9.99 },
                { description: 'SSL Certificate', quantity: 3, price: 49.99 }
            ]
        },
        {
            id: 'INV-2024-002',
            customer: 'Innovation Labs',
            email: 'billing@innolabs.com',
            date: '2024-01-11',
            dueDate: '2024-02-11',
            amount: 2499.99,
            status: 'pending',
            items: [
                { description: 'Serveur Dédié', quantity: 1, price: 199.99 },
                { description: 'VPS Enterprise', quantity: 2, price: 79.99 }
            ]
        },
        {
            id: 'INV-2024-003',
            customer: 'Digital Solutions',
            email: 'finance@digital.fr',
            date: '2024-01-10',
            dueDate: '2024-02-10',
            amount: 899.99,
            status: 'paid',
            items: [
                { description: 'VPS Starter', quantity: 5, price: 9.99 },
                { description: 'Hébergement WordPress', quantity: 3, price: 14.99 }
            ]
        },
        {
            id: 'INV-2024-004',
            customer: 'StartUp Inc',
            email: 'admin@startup.io',
            date: '2024-01-05',
            dueDate: '2024-02-05',
            amount: 349.99,
            status: 'overdue',
            items: [
                { description: 'VPS Pro', quantity: 1, price: 29.99 },
                { description: 'Cloud Storage 100GB', quantity: 2, price: 2.99 }
            ]
        },
        {
            id: 'INV-2024-005',
            customer: 'E-Commerce Plus',
            email: 'billing@ecom.fr',
            date: '2024-01-08',
            dueDate: '2024-02-08',
            amount: 4599.99,
            status: 'paid',
            items: [
                { description: 'Cloud Hosting', quantity: 5, price: 14.99 },
                { description: 'CDN Service', quantity: 10, price: 8.00 }
            ]
        }
    ];

    const paymentMethods: PaymentMethod[] = [
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', default: true },
        { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/26', default: false },
        { id: 3, type: 'PayPal', email: 'user@example.com', default: false }
    ];

    const transactions: Transaction[] = [
        { id: 1, date: '2024-01-12', description: 'INV-2024-001', amount: 1249.99, status: 'completed', method: 'Visa ••••4242' },
        { id: 2, date: '2024-01-10', description: 'INV-2024-003', amount: 899.99, status: 'completed', method: 'Mastercard ••••5555' },
        { id: 3, date: '2024-01-08', description: 'INV-2024-005', amount: 4599.99, status: 'completed', method: 'PayPal' },
        { id: 4, date: '2024-01-05', description: 'Remboursement INV-2023-450', amount: -250.00, status: 'refunded', method: 'Visa ••••4242' }
    ];

    const statusConfig = {
        paid: { label: 'Payée', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
        pending: { label: 'En attente', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Clock },
        overdue: { label: 'En retard', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
        draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400', icon: FileText }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const ActiveStatusIcon = selectedInvoice ? statusConfig[selectedInvoice.status].icon : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Facturation & Paiements</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez vos factures et méthodes de paiement</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Plus className="w-5 h-5" />
                        Nouvelle Facture
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        {[
                            { id: 'invoices', label: 'Factures', count: invoices.length },
                            { id: 'payments', label: 'Moyens de paiement', count: paymentMethods.length },
                            { id: 'transactions', label: 'Transactions', count: transactions.length }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as 'invoices' | 'payments' | 'transactions')}
                                className={`px-6 py-3 font-semibold ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Invoices Tab */}
                        {activeTab === 'invoices' && (
                            <div>
                                {/* Filters */}
                                <div className="flex gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" placeholder="Rechercher une facture..." value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                                    </div>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                        <option value="all">Tous les statuts</option>
                                        <option value="paid">Payées</option>
                                        <option value="pending">En attente</option>
                                        <option value="overdue">En retard</option>
                                    </select>
                                </div>

                                {/* Invoices Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Numéro</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Client</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Échéance</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Montant</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredInvoices.map(invoice => {
                                                const StatusIcon = statusConfig[invoice.status].icon;
                                                return (
                                                    <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <td className="py-4 px-4">
                                                            <span className="font-mono text-sm text-gray-900 dark:text-white">{invoice.id}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="font-semibold text-gray-900 dark:text-white">{invoice.customer}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.email}</div>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{invoice.date}</td>
                                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{invoice.dueDate}</td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-semibold text-gray-900 dark:text-white">€{invoice.amount.toFixed(2)}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig[invoice.status].color}`}>
                                                                {statusConfig[invoice.status].label}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button onClick={() => setSelectedInvoice(invoice)}
                                                                    className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded">
                                                                    <Download className="w-4 h-4" />
                                                                </button>
                                                                {invoice.status === 'pending' && (
                                                                    <button onClick={() => { setSelectedInvoice(invoice); setShowPaymentModal(true); }}
                                                                        className="p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded">
                                                                        <CreditCard className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Payment Methods Tab */}
                        {activeTab === 'payments' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="text-sm font-semibold">{method.type}</div>
                                                    {method.default && (
                                                        <span className="px-2 py-1 bg-white/20 rounded text-xs font-semibold">Par défaut</span>
                                                    )}
                                                </div>
                                                <div className="font-mono text-2xl mb-4">
                                                    {method.last4 ? `•••• •••• •••• ${method.last4}` : method.email}
                                                </div>
                                                {method.expiry && (
                                                    <div className="text-sm">Expire: {method.expiry}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                                        <Plus className="w-8 h-8 text-gray-400" />
                                        <span className="font-semibold text-gray-600 dark:text-gray-400">Ajouter une carte</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Méthode</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Montant</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{transaction.date}</td>
                                                <td className="py-4 px-4">
                                                    <span className="font-medium text-gray-900 dark:text-white">{transaction.description}</span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{transaction.method}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className={`font-semibold ${transaction.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                        {transaction.amount < 0 ? '-' : '+'}€{Math.abs(transaction.amount).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${transaction.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {transaction.status === 'completed' ? 'Complétée' : 'Remboursée'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Détails de la facture</h3>
                            <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedInvoice.id}</div>
                                        <div className="text-gray-600 dark:text-gray-400">Date: {selectedInvoice.date}</div>
                                        <div className="text-gray-600 dark:text-gray-400">Échéance: {selectedInvoice.dueDate}</div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusConfig[selectedInvoice.status].color}`}>
                                        {statusConfig[selectedInvoice.status].label}
                                    </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Facturer à:</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.customer}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{selectedInvoice.email}</div>
                                </div>
                            </div>
                            <table className="w-full mb-6">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                                        <th className="text-center py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Qté</th>
                                        <th className="text-right py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Prix</th>
                                        <th className="text-right py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.items.map((item, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-3 text-gray-900 dark:text-white">{item.description}</td>
                                            <td className="py-3 text-center text-gray-600 dark:text-gray-400">{item.quantity}</td>
                                            <td className="py-3 text-right text-gray-600 dark:text-gray-400">€{item.price.toFixed(2)}</td>
                                            <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                €{(item.quantity * item.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end">
                                <div className="w-64">
                                    <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">€{selectedInvoice.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                                    <Download className="w-4 h-4 inline mr-2" />
                                    Télécharger
                                </button>
                                {selectedInvoice.status === 'pending' && (
                                    <button onClick={() => { setSelectedInvoice(null); setShowPaymentModal(true); }}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                        Payer maintenant
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Effectuer un paiement</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant à payer</div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">€1,249.99</div>
                            </div>
                            <div className="space-y-4 mb-6">
                                {paymentMethods.slice(0, 2).map(method => (
                                    <label key={method.id} className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500">
                                        <input type="radio" name="payment" className="w-5 h-5" defaultChecked={method.default} />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-white">{method.type}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">•••• {method.last4}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <button onClick={() => { setShowPaymentModal(false); alert('Paiement effectué !'); }}
                                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
                                Confirmer le paiement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPaymentSystem;
