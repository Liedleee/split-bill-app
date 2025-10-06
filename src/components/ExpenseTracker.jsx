import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Daftarkan komponen Chart.js yang akan digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseTracker = ({ user }) => {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    // State baru untuk ringkasan
    const [totalToday, setTotalToday] = useState(0);
    const [totalMonth, setTotalMonth] = useState(0);
    // State baru untuk data grafik
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    // useEffect untuk mengambil data dan berlangganan realtime
    useEffect(() => {
        const fetchAndSubscribe = () => {
            const fetchExpenses = async () => {
                setLoading(true);
                const { data, error } = await supabase
                    .from('expenses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (error) console.error('Error fetching expenses:', error);
                else setExpenses(data || []);
                setLoading(false);
            };
            fetchExpenses();

            const channel = supabase
                .channel(`expenses-channel-${user.id}`)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` }, 
                () => fetchExpenses() // Ambil ulang semua data saat ada perubahan
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
        fetchAndSubscribe();
    }, [user.id]);

    // useEffect untuk memproses data setiap kali daftar pengeluaran berubah
    useEffect(() => {
        const processData = () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            // Kalkulasi total hari ini
            const todayExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.created_at);
                return expDate.getDate() === today.getDate() &&
                       expDate.getMonth() === currentMonth &&
                       expDate.getFullYear() === currentYear;
            });
            const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            setTotalToday(todayTotal);

            // Kalkulasi total bulan ini
            const monthExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.created_at);
                return expDate.getMonth() === currentMonth &&
                       expDate.getFullYear() === currentYear;
            });
            const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            setTotalMonth(monthTotal);

            // Siapkan data untuk grafik 7 hari terakhir
            const labels = [];
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                labels.push(date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric'}));
                
                const dailyTotal = expenses
                    .filter(exp => new Date(exp.created_at).toDateString() === date.toDateString())
                    .reduce((sum, exp) => sum + exp.amount, 0);
                data.push(dailyTotal);
            }

            setChartData({
                labels,
                datasets: [{
                    label: 'Pengeluaran',
                    data,
                    fill: false,
                    borderColor: '#06b6d4', // Warna cyan
                    tension: 0.1
                }]
            });
        };
        if (expenses.length > 0) {
            processData();
        }
    }, [expenses]);


    const addExpense = async (e) => {
        e.preventDefault();
        if (!description || !amount) return;
        const { error } = await supabase
            .from('expenses')
            .insert([{ description, amount: parseFloat(amount), user_id: user.id }]);
        if (error) console.error('Error adding expense:', error);
        else {
            setDescription('');
            setAmount('');
        }
    };

    const deleteExpense = async (id) => {
        await supabase.from('expenses').delete().eq('id', id);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Bagian Ringkasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Total Pengeluaran Hari Ini</h3>
                    <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">Rp{totalToday.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Total Pengeluaran Bulan Ini</h3>
                    <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">Rp{totalMonth.toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* Bagian Grafik */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Aktivitas 7 Hari Terakhir</h3>
                 <Line data={chartData} options={{ responsive: true }} />
            </div>

            {/* Bagian Input dan Daftar */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg transition-colors duration-300">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Catat Pengeluaran Harian</h2>
                
                <form onSubmit={addExpense} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Contoh: Makan siang, Transportasi..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex-grow p-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-gray-200 transition"
                    />
                    <input
                        type="number"
                        placeholder="Jumlah (Rp)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full sm:w-48 p-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-gray-200 transition"
                    />
                    <button type="submit" className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg transition hover:bg-cyan-700 hover:shadow-md">
                        Tambah
                    </button>
                </form>

                <div className="space-y-3">
                    {loading && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Memuat data...</p>}
                    {!loading && expenses.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Belum ada pengeluaran tercatat.</p>}
                    {expenses.map(expense => (
                        <div key={expense.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 p-4 rounded-lg shadow-sm">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{expense.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(expense.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-red-500 text-lg">- Rp{Number(expense.amount).toLocaleString('id-ID')}</span>
                                <button onClick={() => deleteExpense(expense.id)} className="text-gray-400 hover:text-red-500 text-2xl leading-none transition-colors">&times;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;

