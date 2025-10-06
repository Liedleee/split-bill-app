import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// Ikon untuk tombol lihat/sembunyikan password
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;


const AuthComponent = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    // State baru untuk mengontrol visibilitas password
    const [showPassword, setShowPassword] = useState(false);

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
                setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50 dark:bg-slate-900 transition-colors">
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-md text-center animate-fade-in">
                <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 mb-2">
                    {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
                </h1>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                    {isLogin ? 'Masuk untuk melanjutkan ke Finance Track' : 'Daftar untuk memulai perjalanan finansial Anda'}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Alamat Email"
                        required
                        className="w-full p-4 bg-gray-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:text-gray-200"
                    />
                    {/* Input password sekarang dibungkus dalam div */}
                    <div className="relative">
                         <input
                            type={showPassword ? "text" : "password"} // Tipe input berubah berdasarkan state
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="parhan pikun ajg"
                            required
                            className="w-full p-4 pr-12 bg-gray-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:text-gray-200"
                        />
                        {/* Tombol untuk toggle visibilitas password */}
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 border-none rounded-lg bg-cyan-600 text-white font-semibold text-lg cursor-pointer transition hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memproses...' : (isLogin ? 'Login' : 'Daftar')}
                    </button>
                </form>
                <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="bg-transparent border-none text-cyan-500 font-bold cursor-pointer ml-1 hover:underline">
                        {isLogin ? 'Daftar' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthComponent;

