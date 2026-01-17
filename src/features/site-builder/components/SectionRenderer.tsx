import React from 'react';
import { SiteSection } from '../../../types/site.types';

interface SectionRendererProps {
    section: SiteSection;
    isPreview?: boolean;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, isPreview }) => {
    const { type, content } = section;

    const baseClass = "py-16 px-6";

    import { FormRenderer } from './forms/FormRenderer';

    switch (type) {
        case 'form':
            return (
                <section className={`${baseClass} bg-white`}>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">{content.heading}</h2>
                            <p className="text-lg text-slate-600">{content.subheading}</p>
                        </div>
                        {content.form && (
                            <FormRenderer form={content.form} previewMode={isPreview} />
                        )}
                    </div>
                </section>
            );

        case 'hero':
            return (
                <section
                    className={`${baseClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center bg-cover bg-center relative`}
                    style={{ backgroundImage: content.image ? `url(${content.image})` : undefined }}
                >
                    {content.image && <div className="absolute inset-0 bg-black/50" />}
                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold mb-4">{content.heading}</h1>
                        <p className="text-xl mb-8">{content.subheading}</p>
                        {content.cta && (
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">
                                {content.cta.text}
                            </button>
                        )}
                    </div>
                </section>
            );

        case 'about':
            return (
                <section className={`${baseClass} bg-white`}>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">{content.heading}</h2>
                        <p className="text-lg text-slate-600 mb-8">{content.text}</p>
                        {content.items && (
                            <div className="flex flex-wrap justify-center gap-4">
                                {content.items.map((item: any, idx: number) => (
                                    <span key={idx} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                                        {typeof item === 'string' ? item : JSON.stringify(item)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            );

        case 'services':
            return (
                <section className={`${baseClass} bg-slate-50`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">{content.heading}</h2>
                            <p className="text-xl text-slate-600">{content.subheading}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {content.items?.map((item: any, idx: number) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            );

        case 'gallery':
            return (
                <section className={`${baseClass} bg-white`}>
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">{content.heading}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {content.items?.map((item: any, idx: number) => (
                                <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-lg group relative">
                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold text-lg">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            );

        case 'contact':
            return (
                <section className={`${baseClass} bg-slate-900 text-white`}>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">{content.heading}</h2>
                        <p className="text-xl mb-4">{content.subheading}</p>
                        <p className="mb-8 opacity-80">{content.text}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {content.items?.map((item: any, idx: number) => (
                                <div key={idx} className="bg-slate-800 p-4 rounded-lg">
                                    <p className="text-slate-400 text-sm uppercase font-bold mb-1">{item.type}</p>
                                    <p>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="max-w-md mx-auto space-y-4">
                            <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-lg text-slate-900" />
                            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg text-slate-900" />
                            <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg text-slate-900" />
                            <button className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
                                Send Message
                            </button>
                        </div>
                    </div>
                </section>
            );

        default:
            return (
                <div className="p-12 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Section type '{type}' not implemented yet</p>
                </div>
            );
    }
};
