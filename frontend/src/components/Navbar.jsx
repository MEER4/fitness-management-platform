import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/' },
        { name: 'Progress', path: '/progress' },
        { name: 'Profile', path: '/profile' },
    ];

    if (user.role === 'coach') {
        // Insert 'My Clients' after Dashboard
        navLinks.splice(1, 0, { name: 'My Clients', path: '/clients' });
        // Add Coach Plans?
        navLinks.splice(2, 0, { name: 'My Plans', path: '/coach-plans' });
        navLinks.splice(3, 0, { name: 'Requests', path: '/pending-requests' });
    } else {
        navLinks.splice(1, 0, { name: 'My Workouts', path: '/my-workouts' });
        navLinks.splice(2, 0, { name: 'My Plan', path: '/my-plan' });
        navLinks.splice(3, 0, { name: 'Browse Plans', path: '/browse-plans' });
    }

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    }

    return (
        <nav className="bg-white dark:bg-[#171717] shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1
                            onClick={() => handleNavigation('/')}
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-[#d4af37] transition-colors mr-10"
                        >
                            Yeimi Fitness
                        </h1>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => handleNavigation(link.path)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path) || (link.path !== '/' && location.pathname.startsWith(link.path))
                                        ? 'bg-blue-100 text-blue-700 dark:bg-[#d4af37]/20 dark:text-[#d4af37]'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="h-5 w-5 text-yellow-400" />
                            ) : (
                                <MoonIcon className="h-5 w-5 text-gray-600" />
                            )}
                        </button>

                        <div className="hidden md:flex items-center space-x-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{user.name || user.email}</span>
                            <span className="bg-blue-100 text-blue-800 dark:bg-[#d4af37]/20 dark:text-[#d4af37] px-3 py-1 rounded-full text-xs font-semibold capitalize border border-blue-200 dark:border-[#d4af37]/30">
                                {user.role}
                            </span>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-[#d4af37]"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-800 shadow-lg">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => handleNavigation(link.path)}
                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive(link.path) || (link.path !== '/' && location.pathname.startsWith(link.path))
                                    ? 'bg-blue-100 text-blue-700 dark:bg-[#d4af37]/20 dark:text-[#d4af37]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                            <div className="flex items-center px-5">
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-gray-800 dark:text-white">{user.name || user.email}</div>
                                    <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400 mt-1 capitalize">{user.role}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
