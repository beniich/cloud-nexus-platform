import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/Modal';

export default function ProductsPage() {
    const { t } = useTranslation();
    const [products, setProducts] = useState([
        { id: 1, name: 'Produit A', price: 99.99, stock: 50, category: 'Electronique' },
        { id: 2, name: 'Produit B', price: 49.99, stock: 100, category: 'Logiciel' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0, category: '' });
    const [editingId, setEditingId] = useState<number | null>(null);

    const addOrUpdateProduct = () => {
        if (editingId) {
            setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...newProduct } : p) as any);
            toast.success(t('products.toast.updated', 'Produit mis à jour!'));
        } else {
            setProducts(prev => [...prev, { id: Date.now(), ...newProduct }]);
            toast.success(t('products.toast.added', 'Produit ajouté!'));
        }
        setShowModal(false);
        setNewProduct({ name: '', price: 0, stock: 0, category: '' });
        setEditingId(null);
    };

    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success(t('products.toast.deleted', 'Produit supprimé!'));
    };

    const editProduct = (product: any) => {
        setNewProduct({ name: product.name, price: product.price, stock: product.stock, category: product.category });
        setEditingId(product.id);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('products.title', 'Gestion des Produits')}</h2>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex gap-2 hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" /> {t('products.add_btn', 'Ajouter Produit')}
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('products.table.name', 'Nom')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('products.table.price', 'Prix')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('products.table.stock', 'Stock')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('products.table.category', 'Catégorie')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('products.table.actions', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{product.price} €</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{product.stock}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => editProduct(product)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? t('products.modal.edit_title', 'Modifier Produit') : t('products.modal.add_title', 'Ajouter Produit')}>
                <input
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder={t('products.table.name', 'Nom')}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    placeholder={t('products.table.price', 'Prix')}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    placeholder={t('products.table.stock', 'Stock')}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder={t('products.table.category', 'Catégorie')}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={addOrUpdateProduct} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    {editingId ? t('products.modal.update_submit', 'Mettre à jour') : t('products.modal.add_submit', 'Ajouter')}
                </button>
            </Modal>
        </div>
    );
}
