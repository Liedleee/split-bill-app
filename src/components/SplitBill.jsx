import React, { useState, useEffect } from 'react';

const SplitBill = () => {
    const [bill, setBill] = useState('');
    const [includeTax, setIncludeTax] = useState(true);
    const [taxPercentage, setTaxPercentage] = useState(11);
    const [numPeople, setNumPeople] = useState(1);
    const [totalPerPerson, setTotalPerPerson] = useState(0.00);

    useEffect(() => {
        const billAmount = parseFloat(bill);
        const peopleCount = parseInt(numPeople);
        if (billAmount > 0 && peopleCount > 0) {
            const taxAmount = includeTax ? billAmount * (taxPercentage / 100) : 0;
            const totalAmount = billAmount + taxAmount;
            const perPerson = totalAmount / peopleCount;
            setTotalPerPerson(perPerson.toFixed(2));
        } else {
            setTotalPerPerson(0.00);
        }
    }, [bill, taxPercentage, numPeople, includeTax]);

    const handleReset = () => {
        setBill('');
        setIncludeTax(true);
        setTaxPercentage(11);
        setNumPeople(1);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg transition-colors duration-300 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">Kalkulator Split Bill</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Kolom Input */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Tagihan (Rp)</label>
                        <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0" className="w-full p-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg text-2xl font-semibold text-right dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pajak (PPN)</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg mb-2">
                            <input type="checkbox" id="includeTax" checked={includeTax} onChange={() => setIncludeTax(!includeTax)} className="h-5 w-5 rounded text-cyan-600 focus:ring-cyan-500 border-gray-300" />
                            <label htmlFor="includeTax" className="text-gray-800 dark:text-gray-200 font-medium">Sertakan Pajak</label>
                        </div>
                        {includeTax && (
                            <div className="grid grid-cols-3 gap-2">
                                {[5, 10, 11].map(tax => (
                                    <button key={tax} onClick={() => setTaxPercentage(tax)} className={`p-2 rounded-md font-semibold transition ${taxPercentage === tax ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-slate-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-500'}`}>
                                        {tax}%
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah Orang</label>
                        <input type="number" value={numPeople} onChange={(e) => setNumPeople(e.target.value)} min="1" className="w-full p-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg text-2xl font-semibold text-right dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                    </div>
                </div>
                {/* Kolom Hasil */}
                <div className="bg-gradient-to-br from-cyan-600 to-teal-600 dark:from-cyan-800 dark:to-teal-800 rounded-xl p-8 flex flex-col justify-between text-white">
                    <div>
                        <p className="text-cyan-200 dark:text-cyan-300">Total per Orang</p>
                        <p className="text-5xl font-bold break-all">Rp{Number(totalPerPerson).toLocaleString('id-ID')}</p>
                    </div>
                    <button onClick={handleReset} className="w-full mt-6 p-3 bg-white text-cyan-700 font-bold rounded-lg transition hover:bg-gray-200 hover:scale-105 uppercase">Reset</button>
                </div>
            </div>
        </div>
    );
};

export default SplitBill;

