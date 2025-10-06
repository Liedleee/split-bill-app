import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AuthComponent from "./components/AuthComponent";
import MainAppComponent from "./components/MainAppComponent";

// Fungsi untuk mendapatkan tema awal
const getInitialTheme = () => {
    // 1. Cek pilihan yang tersimpan di localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs;
        }
    }
    // 2. Jika tidak ada, gunakan preferensi sistem sebagai default
    return 'system'; 
};


function App() {
    const [session, setSession] = useState(null);
    const [theme, setTheme] = useState(getInitialTheme);

    // useEffect untuk menerapkan tema ke elemen <html>
    useEffect(() => {
        const root = window.document.documentElement;
        let effectiveTheme = theme;

        // Jika tema diatur ke 'system', tentukan tema efektif berdasarkan preferensi OS
        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
                ? 'dark' 
                : 'light';
        }

        // Terapkan class yang benar
        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);
        
        // Simpan pilihan pengguna (light, dark, atau system)
        localStorage.setItem('theme', theme);

    }, [theme]);


    // useEffect untuk mendengarkan perubahan tema di level OS
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = () => {
            // Hanya update jika pengguna sedang dalam mode 'system'
            if (localStorage.getItem('theme') === 'system') {
                // Memicu re-render dengan "memperbarui" state ke nilainya saat ini
                // yang akan menjalankan useEffect di atas untuk menerapkan tema yang benar.
                setTheme('system'); 
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);


    // useEffect untuk mengelola sesi login Supabase
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return !session ? (
        <AuthComponent />
    ) : (
        <MainAppComponent
            key={session.user.id}
            session={session}
            theme={theme}
            setTheme={setTheme}
        />
    );
}

export default App;

