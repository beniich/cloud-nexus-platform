import React from 'react';

export default function InvoiceTemplate() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-[#111] font-sans min-h-screen relative flex flex-col items-center py-8">

            {/* Action Bar (No Print) */}
            <div className="fixed top-0 left-0 w-full bg-[#1a110a]/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center z-50 print:hidden">
                <div className="flex items-center gap-4">
                    <button className="text-white/70 hover:text-white flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-semibold">Back to Billing</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-lg">print</span>
                        Print
                    </button>
                    <button className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Spacer for Action Bar */}
            <div className="h-16 print:hidden"></div>

            {/* A4 Paper Invoice */}
            <div className="max-w-[210mm] w-full mx-auto bg-white text-slate-900 p-[10mm] shadow-2xl min-h-[297mm] relative rounded-lg print:shadow-none print:w-full print:max-w-none print:m-0">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <span className="material-symbols-outlined text-3xl">cloud_circle</span>
                            <span className="text-2xl font-bold text-slate-900">Cloud Nexus</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">123 Tech Avenue, Silicon Valley</p>
                        <p className="text-sm text-gray-500 font-medium">San Francisco, CA 94105</p>
                        <p className="text-sm text-gray-500 font-medium">billing@cloudnexus.io</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-mono text-gray-200 font-bold mb-2">INVOICE</h1>
                        <p className="text-sm font-bold text-gray-900">#INV-2026-001</p>
                        <p className="text-sm text-gray-500 mt-1">Date: <span className="text-gray-900">Jan 23, 2026</span></p>
                        <p className="text-sm text-gray-500">Due Date: <span className="text-gray-900">Jan 30, 2026</span></p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="flex justify-between mb-12">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Bill To</h3>
                        <p className="text-lg font-bold text-slate-900">Sarah Chen</p>
                        <p className="text-sm text-gray-500">sarah.chen@nexus.com</p>
                        <p className="text-sm text-gray-500">45 Rue de la Paix, Paris, France</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Method</h3>
                        <div className="flex items-center justify-end gap-2">
                            <span className="material-symbols-outlined text-gray-600">credit_card</span>
                            <span class="text-sm font-bold text-slate-900">Visa ending in 4242</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Processed on Jan 23, 2026</p>
                    </div>
                </div>

                {/* Line Items */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Description</th>
                            <th className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Qty</th>
                            <th className="py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Unit Price</th>
                            <th className="py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        <tr className="border-b border-gray-100">
                            <td className="py-4 font-medium text-slate-900">
                                Pro Hosting Plan - Monthly
                                <span className="block text-xs text-gray-400 font-normal mt-0.5">Jan 23 - Feb 23, 2026</span>
                            </td>
                            <td className="py-4 text-center">1</td>
                            <td className="py-4 text-right">$29.00</td>
                            <td className="py-4 text-right font-bold">$29.00</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 font-medium text-slate-900">
                                Domain Registration (nexus-example.com)
                                <span class="block text-xs text-gray-400 font-normal mt-0.5">1 Year</span>
                            </td>
                            <td className="py-4 text-center">1</td>
                            <td className="py-4 text-right">$12.00</td>
                            <td className="py-4 text-right font-bold">$12.00</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 font-medium text-slate-900">
                                Premium SSL Certificate
                                <span class="block text-xs text-gray-400 font-normal mt-0.5">Single Domain</span>
                            </td>
                            <td className="py-4 text-center">1</td>
                            <td className="py-4 text-right">$5.00</td>
                            <td className="py-4 text-right font-bold">$5.00</td>
                        </tr>
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span class="font-medium">$46.00</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax (20%)</span>
                            <span class="font-medium">$9.20</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                            <span class="text-sm font-bold text-slate-900">Total USD</span>
                            <span class="text-2xl font-bold text-primary">$55.20</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-gray-100 pt-8 mt-auto">
                    <p className="text-sm text-slate-900 font-bold mb-1">Thank you for your business!</p>
                    <p class="text-xs text-gray-500">If you have any questions about this invoice, please contact support.</p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400 rounded-b-lg print:hidden"></div>
            </div>
        </div>
    );
}
