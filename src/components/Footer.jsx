import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Financia. Liedle Nursalil
                </p>
            </div>
        </footer>
    );
};

export default Footer;
