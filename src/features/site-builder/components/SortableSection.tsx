import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
    id: string;
    children: React.ReactNode;
    isActive?: boolean;
}

export const SortableSection: React.FC<SortableSectionProps> = ({ id, children, isActive }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group ${isDragging ? 'opacity-50 z-50' : ''}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-lg transition-all"
                title="Drag to reorder"
            >
                <GripVertical className="h-5 w-5 text-slate-400" />
            </div>

            <div className={`transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-blue-300 ring-offset-1'}`}>
                {children}
            </div>
        </div>
    );
};
