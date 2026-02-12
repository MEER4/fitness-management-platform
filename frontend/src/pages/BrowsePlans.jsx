import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BrowsePlans = () => {
    const { t } = useTranslation();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/plans');
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching plans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleRequestPlan = async (planId) => {
        try {
            await api.post('/subscriptions/request', { plan_id: planId });
            toast.success(t('browse_plans.request_success'));
        } catch (error) {
            console.error("Error requesting plan", error);
            toast.error(t('browse_plans.request_error'));
        }
    };

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('browse_plans.title')}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-t-4 border-blue-500 dark:border-[#d4af37] flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{plan.title}</h2>
                            <p className="text-3xl font-bold text-blue-600 dark:text-[#d4af37] mb-4">${plan.price}</p>
                            <div className="flex-grow">
                                <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">{plan.description}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">{t('browse_plans.duration', { count: plan.duration })}</p>
                            </div>
                            <button
                                onClick={() => handleRequestPlan(plan.id)}
                                className="w-full bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold py-2 rounded hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors"
                            >
                                {t('browse_plans.request')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowsePlans;
