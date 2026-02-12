import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log("Submitting login...");
        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            console.log("Success");
            navigate('/');
        } else {
            console.log("Failed", result.error);
            setError(result.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#0a0a0a] transition-colors duration-300">
            <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-[#171717] shadow-lg rounded-lg border dark:border-gray-800">
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Login to your account</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                            <input
                                type="text"
                                placeholder="Email"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
                        <div className="flex items-baseline justify-between">
                            <button
                                disabled={isLoading}
                                className={`px-6 py-2 mt-4 text-white rounded-lg transition-colors ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-900 dark:bg-[#d4af37] dark:hover:bg-[#b5952f] dark:text-black font-semibold'}`}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
