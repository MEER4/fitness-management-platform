import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const CoachPlans = () => {
    const { t } = useTranslation();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/plans');
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching plans", error);
                toast.error(t('coach_plans.error_load'));
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm(t('coach_plans.delete_confirm'))) return;

        try {
            await api.delete(`/plans/${id}`);
            setPlans(plans.filter(plan => plan.id !== id));
            toast.success(t('coach_plans.delete_success'));
        } catch (error) {
            console.error("Error deleting plan", error);
            toast.error(t('coach_plans.error_delete'));
        }
    };

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-4 md:p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('coach_plans.title')}</h1>
                    <button
                        onClick={() => navigate('/create-plan')}
                        className="bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors"
                    >
                        {t('coach_plans.create_new')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-[#d4af37] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{plan.title}</h2>
                                    <span className="text-blue-600 dark:text-[#d4af37] font-bold text-lg">${plan.price}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">{plan.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">{t('coach_plans.duration', { count: plan.duration })}</p>
                            </div>

                            <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
                                <button
                                    onClick={() => navigate(`/edit-plan/${plan.id}`)}
                                    className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#d4af37] transition-colors"
                                >
                                    <PencilIcon className="h-4 w-4 mr-1" />
                                    {t('coach_plans.edit')}
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="flex items-center text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4 mr-1" />
                                    {t('coach_plans.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                            {t('coach_plans.no_plans')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoachPlans;
