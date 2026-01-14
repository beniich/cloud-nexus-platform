import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/shared/ui/Modal';

export default function ProductsPage() {
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
            toast.success('Produit mis à jour!');
        } else {
            setProducts(prev => [...prev, { id: Date.now(), ...newProduct }]);
            toast.success('Produit ajouté!');
        }
        setShowModal(false);
        setNewProduct({ name: '', price: 0, stock: 0, category: '' });
        setEditingId(null);
    };

    const deleteProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Produit supprimé!');
    };

    const editProduct = (product: any) => {
        setNewProduct({ name: product.name, price: product.price, stock: product.stock, category: product.category });
        setEditingId(product.id);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Produits</h2>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex gap-2 hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" /> Ajouter Produit
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier Produit' : 'Ajouter Produit'}>
                <input
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nom"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    placeholder="Prix"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    placeholder="Stock"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="Catégorie"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={addOrUpdateProduct} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
            </Modal>
        </div>
    );
}
