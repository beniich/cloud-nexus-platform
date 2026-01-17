import React, { useState } from 'react';
import { Form, FormField, FormFieldType } from '../../../types/forms.types';
import {
    Plus, Trash2, GripVertical, Settings,
    Type, Mail, Phone, Calendar, Hash, CheckSquare, List
} from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormEditorProps {
    form: Form;
    onUpdate: (updatedForm: Form) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ form, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'fields' | 'settings'>('fields');
    const [selectedField, setSelectedField] = useState<string | null>(null);

    const handleAddField = (type: FormFieldType) => {
        const newField: FormField = {
            id: `field-${Date.now()}`,
            type,
            label: `New ${type} field`,
            name: `${type}_${Date.now()}`,
            required: false,
            order: form.fields.length,
            width: 'full',
            placeholder: `Enter ${type}...`
        };

        onUpdate({
            ...form,
            fields: [...form.fields, newField]
        });
        setSelectedField(newField.id);
    };

    const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
        onUpdate({
            ...form,
            fields: form.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        });
    };

    const handleDeleteField = (fieldId: string) => {
        if (confirm('Delete this field?')) {
            onUpdate({
                ...form,
                fields: form.fields.filter(f => f.id !== fieldId)
            });
            setSelectedField(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = form.fields.findIndex(f => f.id === active.id);
            const newIndex = form.fields.findIndex(f => f.id === over.id);
            const newFields = arrayMove(form.fields, oldIndex, newIndex);

            // Re-assign order based on index
            const orderedFields = newFields.map((f, index) => ({ ...f, order: index }));

            onUpdate({ ...form, fields: orderedFields });
        }
    };

    const handleUpdateSettings = (updates: Partial<Form['settings']>) => {
        onUpdate({
            ...form,
            settings: { ...form.settings, ...updates }
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex bg-white border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('fields')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'fields'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Fields
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Settings
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'fields' ? (
                    <div className="space-y-6">
                        {/* Field Types Palette */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            <FieldTypeButton icon={Type} label="Text" onClick={() => handleAddField('text')} />
                            <FieldTypeButton icon={Mail} label="Email" onClick={() => handleAddField('email')} />
                            <FieldTypeButton icon={Phone} label="Phone" onClick={() => handleAddField('tel')} />
                            <FieldTypeButton icon={List} label="Textarea" onClick={() => handleAddField('textarea')} />
                            <FieldTypeButton icon={CheckSquare} label="Select" onClick={() => handleAddField('select')} />
                            <FieldTypeButton icon={Calendar} label="Date" onClick={() => handleAddField('date')} />
                        </div>

                        {/* Fields List */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Form Fields</h3>
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={form.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                    {form.fields.map(field => (
                                        <SortableFieldItem
                                            key={field.id}
                                            field={field}
                                            isSelected={selectedField === field.id}
                                            onSelect={() => setSelectedField(field.id)}
                                            onDelete={() => handleDeleteField(field.id)}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>

                        {/* Selected Field Properties */}
                        {selectedField && (
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Field Properties</h3>
                                {form.fields.find(f => f.id === selectedField) && (
                                    <FieldProperties
                                        field={form.fields.find(f => f.id === selectedField)!}
                                        onChange={(updates) => handleUpdateField(selectedField, updates)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Form Settings Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Submit Button Text</label>
                                <input
                                    type="text"
                                    value={form.settings.submitButtonText}
                                    onChange={(e) => handleUpdateSettings({ submitButtonText: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Success Message</label>
                                <textarea
                                    value={form.settings.successMessage}
                                    onChange={(e) => handleUpdateSettings({ successMessage: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notifications Email</label>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={form.settings.emailNotifications?.enabled}
                                        onChange={(e) => handleUpdateSettings({
                                            emailNotifications: {
                                                ...form.settings.emailNotifications!,
                                                enabled: e.target.checked
                                            }
                                        })}
                                    />
                                    <span className="text-sm text-slate-600">Enable email notifications</span>
                                </div>
                                {form.settings.emailNotifications?.enabled && (
                                    <input
                                        type="email"
                                        value={form.settings.emailNotifications.recipients.join(', ')}
                                        onChange={(e) => handleUpdateSettings({
                                            emailNotifications: {
                                                ...form.settings.emailNotifications!,
                                                recipients: e.target.value.split(',').map(s => s.trim())
                                            }
                                        })}
                                        placeholder="admin@example.com"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Start of subcomponents
const FieldTypeButton = ({ icon: Icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors"
    >
        <Icon size={16} className="text-slate-500 mb-1" />
        <span className="text-[10px] text-slate-600 font-medium">{label}</span>
    </button>
);

const SortableFieldItem = ({ field, isSelected, onSelect, onDelete }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 bg-white border rounded-md group cursor-pointer ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
                }`}
            onClick={onSelect}
        >
            <div {...attributes} {...listeners} className="text-slate-400 cursor-move hover:text-slate-600">
                <GripVertical size={16} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{field.label}</p>
                <p className="text-xs text-slate-500 capitalize">{field.type} • {field.required ? 'Required' : 'Optional'}</p>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

const FieldProperties = ({ field, onChange }: { field: FormField, onChange: (u: Partial<FormField>) => void }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Label</label>
            <input
                type="text"
                value={field.label}
                onChange={e => onChange({ label: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
            />
        </div>
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Placeholder</label>
            <input
                type="text"
                value={field.placeholder || ''}
                onChange={e => onChange({ placeholder: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
            />
        </div>
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={field.required}
                onChange={e => onChange({ required: e.target.checked })}
                id="required-toggle"
            />
            <label htmlFor="required-toggle" className="text-sm text-slate-700">Required Field</label>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Width</label>
            <select
                value={field.width || 'full'}
                onChange={e => onChange({ width: e.target.value as any })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
            >
                <option value="full">Full Width</option>
                <option value="half">Half Width (50%)</option>
                <option value="third">One Third (33%)</option>
            </select>
        </div>

        {field.type === 'select' && (
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Options (comma separated)</label>
                <textarea
                    value={field.options?.map(o => o.label).join(', ') || ''}
                    onChange={e => onChange({
                        options: e.target.value.split(',').map(s => {
                            const val = s.trim();
                            return { label: val, value: val.toLowerCase().replace(/\s+/g, '-') };
                        })
                    })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm"
                    rows={3}
                    placeholder="Option 1, Option 2, Option 3"
                />
            </div>
        )}
    </div>
);
