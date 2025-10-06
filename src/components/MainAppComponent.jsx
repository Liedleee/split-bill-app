import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import ExpenseTracker from './ExpenseTracker';
import DebtTracker from './DebtTracker';
import SplitBill from './SplitBill';
import Navbar from './Navbar';
import Footer from './Footer'; // 1. Impor komponen Footer
import { motion, AnimatePresence } from 'framer-motion';

const MainAppComponent = ({ session }) => {
    const [activeTab, setActiveTab] = useState('pengeluaran');

    const renderContent = () => {
        switch (activeTab) {
            case 'pengeluaran': return <ExpenseTracker user={session.user} />;
            case 'utang': return <DebtTracker user={session.user} />;
            case 'splitbill': return <SplitBill />;
            default: return <ExpenseTracker user={session.user} />;
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 },
    };

    const pageTransition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.4,
    };

    return (
        // 2. Buat layout flex column agar footer bisa menempel di bawah
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
            
            <Navbar 
                session={session}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />

            {/* 3. Buat konten utama bisa tumbuh mengisi ruang */}
            <main className="p-4 sm:p-6 md:p-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            
            <Footer /> {/* 4. Tambahkan komponen Footer di sini */}
        </div>
    );
};

export default MainAppComponent;

