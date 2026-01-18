import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { BillingDetails } from '@/types/payment.types';

interface BillingInfoFormProps {
    initialData?: BillingDetails;
    onSubmit: (data: BillingDetails) => void;
    onCancel?: () => void;
}

export const BillingInfoForm: React.FC<BillingInfoFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState<BillingDetails>(initialData || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'FR',
        },
        taxId: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof BillingDetails, string>>>({});

    const handleChange = (field: keyof BillingDetails, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleAddressChange = (field: keyof BillingDetails['address'], value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value },
        }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof BillingDetails, string>> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Prénom requis';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nom requis';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }
        if (!formData.address.street.trim()) {
            newErrors.address = 'Adresse requise';
        }
        if (!formData.address.city.trim()) {
            newErrors.address = 'Ville requise';
        }
        if (!formData.address.postalCode.trim()) {
            newErrors.address = 'Code postal requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations personnelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => handleChange('firstName', e.target.value)}
                            className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all
                ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
              `}
                            placeholder="John"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => handleChange('lastName', e.target.value)}
                            className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all
                ${errors.lastName ? 'border-red-500' : 'border-gray-300'}
              `}
                            placeholder="Doe"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => handleChange('email', e.target.value)}
                            className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
              `}
                            placeholder="john.doe@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="+33 6 12 34 56 78"
                        />
                    </div>
                </div>
            </div>

            {/* Company Information (Optional) */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <Building2 className="w-5 h-5 inline mr-2" />
                    Informations entreprise (optionnel)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'entreprise
                        </label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={e => handleChange('company', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Cloud Nexus"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Hash className="w-4 h-4 inline mr-1" />
                            Numéro de TVA
                        </label>
                        <input
                            type="text"
                            value={formData.taxId}
                            onChange={e => handleChange('taxId', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="FR12345678901"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    Adresse de facturation
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.address.street}
                            onChange={e => handleAddressChange('street', e.target.value)}
                            className={`
                w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition-all
                ${errors.address ? 'border-red-500' : 'border-gray-300'}
              `}
                            placeholder="123 Rue de la Paix"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ville <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address.city}
                                onChange={e => handleAddressChange('city', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Paris"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Code postal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.address.postalCode}
                                onChange={e => handleAddressChange('postalCode', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="75001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pays <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.address.country}
                                onChange={e => handleAddressChange('country', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="FR">France</option>
                                <option value="BE">Belgique</option>
                                <option value="CH">Suisse</option>
                                <option value="CA">Canada</option>
                                <option value="US">États-Unis</option>
                            </select>
                        </div>
                    </div>

                    {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg 
                     hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors font-medium shadow-lg shadow-blue-600/30"
                >
                    Continuer
                </button>
            </div>
        </form>
    );
};
