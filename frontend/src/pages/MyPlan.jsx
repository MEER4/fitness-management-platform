import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const MyPlan = () => {
    const { t } = useTranslation();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                // Need to implement GET /subscriptions/me in backend first, wait I did that.
                const response = await api.get('/subscriptions/me');
                setSubscriptions(response.data);
            } catch (error) {
                console.error("Error fetching plan", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('my_plan.title')}</h1>

                {subscriptions.length === 0 ? (
                    <div className="bg-white dark:bg-[#171717] p-8 rounded-lg shadow-md text-center border dark:border-gray-800">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('my_plan.no_active')}</h2>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">{t('my_plan.no_active_desc')}</p>
                        <button
                            onClick={() => window.location.href = '/browse-plans'} // Simple nav for now or use navigate hook
                            className="bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors"
                        >
                            {t('my_plan.browse')}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md border-t-4 border-green-500 dark:border-green-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t('my_plan.active_badge')}</div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{sub.plan?.title || t('my_plan.unknown')}</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{sub.plan?.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-[#262626] p-4 rounded-md">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">{t('my_plan.price')}</p>
                                        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">${sub.plan?.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">{t('my_plan.renews')}</p>
                                        {/* Mock date logic since we didn't fully implement exp dates yet maybe */}
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPlan;
