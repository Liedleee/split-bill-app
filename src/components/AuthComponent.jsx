import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// Icon SVG untuk email dan password
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

const AuthComponent = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.');
            }
        } catch (err) {
            setError(err.message || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400">
                        FINANCIA
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {isLogin ? 'Masuk untuk melanjutkan' : 'Buat akun untuk memulai'}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><MailIcon /></span>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Alamat Email" 
                            required 
                            className="w-full p-3 pl-10 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none dark:text-white transition"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><LockIcon /></span>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            required 
                            className="w-full p-3 pl-10 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none dark:text-white transition"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full p-4 border-none rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold text-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:from-cyan-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memproses...' : (isLogin ? 'Login' : 'Daftar')}
                    </button>
                </form>

                <p className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400">
                    {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="bg-transparent border-none text-cyan-600 dark:text-cyan-400 font-bold cursor-pointer ml-1 hover:underline">
                        {isLogin ? 'Daftar di sini' : 'Login di sini'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthComponent;

