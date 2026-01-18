import React, { useState } from 'react';
import { Form, FormField, SubmissionResult } from '../../../../types/forms.types';
import { FormService } from '../../../../services/form-service';
import { AlertCircle, CheckCircle, Send } from 'lucide-react';

interface FormRendererProps {
    form: Form;
    previewMode?: boolean;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ form, previewMode = false }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<SubmissionResult | null>(null);

    // Initialize form service
    const formService = new FormService();

    const handleChange = (fieldName: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Clear error when field is modified
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (previewMode) {
            alert('Form submission is disabled in preview mode');
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setResult(null);

        try {
            const submissionResult = await formService.submitForm(form.id, formData);

            if (submissionResult.success) {
                setResult(submissionResult);
                setFormData({}); // Reset form
            } else {
                // Map API errors to field errors
                const fieldErrors: Record<string, string> = {};
                submissionResult.errors?.forEach(err => {
                    fieldErrors[err.field] = err.message;
                });
                setErrors(fieldErrors);
                setResult(submissionResult);
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'An unexpected error occurred. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result?.success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">{result.message}</p>
                <button
                    onClick={() => setResult(null)}
                    className="mt-4 text-green-600 font-medium hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            {result && !result.success && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-red-800">Error</h4>
                        <p className="text-red-700 text-sm">{result.message}</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {form.fields
                    .sort((a, b) => a.order - b.order)
                    .map(field => (
                        <div key={field.id} className={`${field.width === 'half' ? 'w-1/2 inline-block px-2' :
                            field.width === 'third' ? 'w-1/3 inline-block px-2' : 'w-full block'
                            } mb-4 align-top`}>
                            <RenderField
                                field={field}
                                value={formData[field.name] || ''}
                                error={errors[field.name]}
                                onChange={(val) => handleChange(field.name, val)}
                            />
                        </div>
                    ))}
            </div>

            <div className={`mt-8 ${form.settings.submitButtonStyle === 'outline' ? 'text-center' :
                form.settings.submitButtonStyle === 'secondary' ? 'text-right' : 'text-left'
                }`}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                        inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${getButtonStyle(form.settings.submitButtonStyle)}
                    `}
                >
                    {isSubmitting ? (
                        <>Sending...</>
                    ) : (
                        <>
                            {form.settings.submitButtonText || 'Send Message'}
                            <Send size={18} />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

const RenderField: React.FC<{
    field: FormField;
    value: any;
    error?: string;
    onChange: (val: any) => void;
}> = ({ field, value, error, onChange }) => {
    const baseClasses = `
        w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
        ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'}
    `;

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className={baseClasses}
                />
            ) : field.type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    className={baseClasses}
                >
                    <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                    {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={field.type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={baseClasses}
                />
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {error}
                </p>
            )}
        </div>
    );
};

const getButtonStyle = (style: 'primary' | 'secondary' | 'outline') => {
    switch (style) {
        case 'secondary':
            return 'bg-slate-800 text-white hover:bg-slate-900';
        case 'outline':
            return 'bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-50';
        default: // primary
            return 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl';
    }
};
