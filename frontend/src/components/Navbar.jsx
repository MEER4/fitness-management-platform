import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <h1
                            onClick={() => navigate('/')}
                            className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                        >
                            Yeimi Fitness
                        </h1>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Dashboard
                            </button>

                            {user.role === 'coach' && (
                                <button
                                    onClick={() => navigate('/clients')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/clients') || location.pathname.startsWith('/clients/')
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    My Clients
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/progress')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/progress')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Progress
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/profile')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Profile
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">{user.name || user.email}</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                            {user.role}
                        </span>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="text-gray-500 hover:text-red-600 text-sm font-medium"
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
