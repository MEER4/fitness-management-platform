import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Access global user state
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                email
            };
            if (password) {
                payload.password = password;
            }

            const response = await api.put('/auth/me', payload);
            toast.success(t('profile.success'));
            // Update context
            // You might need to exposing a method in AuthContext to update user without login, 
            // but setUser is available if we consume it properly
            // Let's assume user structure matches response

            // Reload page or force fetchMe? 
            // AuthContext's fetchMe could be exposed, or just simple reload.
            window.location.reload();

        } catch (error) {
            console.error("Error updating profile", error);
            const msg = error.response?.data?.detail || t('profile.error');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-[#171717] rounded-lg shadow-md p-8 border dark:border-gray-800">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('profile.title')}</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('profile.full_name')}</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('profile.email')}</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 dark:bg-[#262626]/50 dark:border-gray-700 dark:text-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled // Keep email disabled for simplicity or safety if desired, but user asked for Update Profile. Let's enable it.
                            // Actually, let's enable it
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('profile.email_note')}</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">{t('profile.new_password')}</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                placeholder={t('profile.password_placeholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold py-2 rounded-md hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? t('profile.saving') : t('profile.save')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
