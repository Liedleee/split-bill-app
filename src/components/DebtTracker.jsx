import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Icon SVG untuk tombol hapus
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;


const DebtTracker = ({ user }) => {
    const [debts, setDebts] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [contact, setContact] = useState('');
    const [type, setType] = useState('iOwe'); // 'iOwe' atau 'owedToMe'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('debts')
                .select('*')
                .eq('user_id', user.id)
                .order('is_paid', { ascending: true }) // Tampilkan yang lunas di bawah
                .order('created_at', { ascending: false });
            if (error) console.error('Error fetching debts:', error);
            else setDebts(data || []);
            setLoading(false);
        };
        fetchDebts();

        const channel = supabase
            .channel(`debts-channel-${user.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'debts', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setDebts(currentDebts => [payload.new, ...currentDebts]
                            .sort((a, b) => a.is_paid - b.is_paid || new Date(b.created_at) - new Date(a.created_at))
                        );
                    }
                    if (payload.eventType === 'UPDATE') {
                        setDebts(currentDebts => currentDebts.map(d => d.id === payload.new.id ? payload.new : d)
                            .sort((a, b) => a.is_paid - b.is_paid || new Date(b.created_at) - new Date(a.created_at))
                        );
                    }
                    // Tambahkan penanganan untuk event DELETE
                    if (payload.eventType === 'DELETE') {
                        setDebts(currentDebts => currentDebts.filter(d => d.id !== payload.old.id));
                    }
                }
            )
            .subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id]);

    const addDebt = async (e) => {
        e.preventDefault();
        if (!description || !amount || !contact) return;
        const { error } = await supabase
            .from('debts')
            .insert([{ description, amount: parseFloat(amount), contact, type, user_id: user.id, is_paid: false }]);
        if (error) console.error('Error adding debt:', error);
        else {
            setDescription('');
            setAmount('');
            setContact('');
        }
    };
    
    const togglePaidStatus = async (id, currentStatus) => {
        await supabase.from('debts').update({ is_paid: !currentStatus }).eq('id', id);
    };

    // Fungsi baru untuk menghapus utang
    const deleteDebt = async (id) => {
        // Konfirmasi sebelum menghapus untuk keamanan
        if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini secara permanen?')) {
            await supabase.from('debts').delete().eq('id', id);
        }
    };


    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg transition-colors duration-300 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Catat Utang & Piutang</h2>
            
            <form onSubmit={addDebt} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <input type="text" placeholder="Keterangan (e.g., Pinjam untuk makan)" value={description} onChange={e => setDescription(e.target.value)} className="p-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <input type="number" placeholder="Jumlah (Rp)" value={amount} onChange={e => setAmount(e.target.value)} className="p-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <input type="text" placeholder="Nama Kontak (e.g., Budi)" value={contact} onChange={e => setContact(e.target.value)} className="p-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <select value={type} onChange={e => setType(e.target.value)} className="p-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="iOwe">Saya Berutang</option>
                    <option value="owedToMe">Dia Berutang</option>
                </select>
                <button type="submit" className="md:col-span-2 p-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 hover:shadow-md transition">Tambah Catatan</button>
            </form>

            <div className="space-y-4">
                {loading && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Memuat data...</p>}
                {!loading && debts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Tidak ada catatan utang/piutang.</p>}
                {debts.map(debt => (
                    <div key={debt.id} className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-300 animate-slide-up ${debt.is_paid ? 'bg-gray-100 dark:bg-slate-700/50 opacity-60' : 'bg-gray-50 dark:bg-slate-700 shadow-sm'}`}>
                        <div>
                            <p className={`font-bold ${debt.is_paid ? 'line-through' : ''} ${debt.type === 'iOwe' ? 'text-red-500' : 'text-green-500'}`}>
                                {debt.type === 'iOwe' ? 'Utang ke' : 'Piutang dari'} {debt.contact}
                            </p>
                            <p className={`text-gray-800 dark:text-gray-200 text-lg font-semibold ${debt.is_paid ? 'line-through' : ''}`}>Rp{Number(debt.amount).toLocaleString('id-ID')}</p>
                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${debt.is_paid ? 'line-through' : ''}`}>{debt.description}</p>
                        </div>
                        {/* Kontainer untuk tombol aksi */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <button onClick={() => togglePaidStatus(debt.id, debt.is_paid)} className={`px-4 py-2 text-sm font-bold rounded-lg text-white transition-all duration-200 ${debt.is_paid ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                {debt.is_paid ? 'Batal Lunas' : 'Tandai Lunas'}
                            </button>
                            {/* Tombol Hapus hanya muncul jika sudah lunas */}
                            {debt.is_paid && (
                                <button 
                                    onClick={() => deleteDebt(debt.id)}
                                    className="p-2.5 bg-red-500 text-white rounded-lg transition hover:bg-red-600"
                                    title="Hapus permanen"
                                >
                                    <TrashIcon />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DebtTracker;

