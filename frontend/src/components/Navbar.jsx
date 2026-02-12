import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white dark:bg-[#171717] shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <h1
                            onClick={() => navigate('/')}
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-[#d4af37] transition-colors"
                        >
                            Yeimi Fitness
                        </h1>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                    ? 'bg-blue-100 text-blue-700 dark:bg-[#d4af37]/20 dark:text-[#d4af37]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Dashboard
                            </button>

                            {user.role === 'coach' && (
                                <button
                                    onClick={() => navigate('/clients')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/clients') || location.pathname.startsWith('/clients/')
                                        ? 'bg-blue-100 text-blue-700 dark:bg-[#d4af37]/20 dark:text-[#d4af37]'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    My Clients
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/progress')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/progress')
                                    ? 'bg-blue-100 text-blue-700 dark:bg-[#d4af37]/20 dark:text-[#d4af37]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Progress
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile')
                                    ? 'bg-blue-100 text-blue-700 dark:bg-[#d4af37]/20 dark:text-[#d4af37]'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                Profile
                            </button>
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
