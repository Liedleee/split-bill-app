import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ session, activeTab, setActiveTab, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        setIsMenuOpen(false);
    };

    // Enhanced NavLink with improved animations
    const NavLink = ({ tabName, label }) => (
        <button
            onClick={() => handleTabClick(tabName)}
            className={`relative w-full text-left md:w-auto px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tabName 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
            {/* Animated pill background with smooth spring animation */}
            {activeTab === tabName && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg shadow-lg z-0"
                    transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 32,
                        mass: 0.8
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                />
            )}
            {/* Text with subtle scale animation on active */}
            <motion.span 
                className="relative z-10"
                animate={{ 
                    scale: activeTab === tabName ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                {label}
            </motion.span>
        </button>
    );

    const HamburgerIcon = () => ( 
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg> 
    );
    
    const CloseIcon = () => ( 
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg> 
    );

    return (
        <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        {/* Logo with subtle animation */}
                        <motion.h1 
                            className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            FINANCIA
                        </motion.h1>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center ml-10 space-x-2">
                            <NavLink tabName="pengeluaran" label="Dasbor" />
                            <NavLink tabName="utang" label="Utang/Piutang" />
                            <NavLink tabName="splitbill" label="Split Bill" />
                        </div>
                    </div>
                    
                    {/* Desktop User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <motion.p 
                            className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {session.user.email}
                        </motion.p>
                        <motion.button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm rounded-lg font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Logout
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button with rotation animation */}
                    <div className="md:hidden">
                        <motion.button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                            whileTap={{ scale: 0.9 }}
                            animate={{ rotate: isMenuOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu with enhanced animations */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                            duration: 0.3,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.div 
                            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                },
                                hidden: {
                                    transition: {
                                        staggerChildren: 0.03,
                                        staggerDirection: -1
                                    }
                                }
                            }}
                        >
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                            >
                                <NavLink tabName="pengeluaran" label="Dasbor Pengeluaran" />
                            </motion.div>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                            >
                                <NavLink tabName="utang" label="Catatan Utang/Piutang" />
                            </motion.div>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                            >
                                <NavLink tabName="splitbill" label="Split Bill" />
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            className="pt-4 pb-3 border-t border-gray-200 dark:border-slate-700"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: 0.15 }}
                        >
                            <div className="px-2 space-y-3">
                                <p className="px-3 text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {session.user.email}
                                </p>
                                <motion.button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-all"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Logout
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;