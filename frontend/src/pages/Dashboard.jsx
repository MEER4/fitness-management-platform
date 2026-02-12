import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { t } = useTranslation();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.welcome')}, {user.name || user.email}!</h1>
                </div>

                {user.role === 'coach' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Coach View */}
                        <div
                            onClick={() => navigate('/coach-plans')}
                            className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500 dark:border-[#d4af37]"
                        >
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.my_plans')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.manage_plans')}</p>
                            <button className="text-blue-600 dark:text-[#d4af37] font-medium hover:underline">{t('dashboard.view_plans')} &rarr;</button>
                        </div>

                        <div
                            onClick={() => navigate('/create-workout')}
                            className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500 dark:border-green-600"
                        >
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.create_workout')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.build_workouts')}</p>
                            <button className="text-green-600 dark:text-green-500 font-medium hover:underline">{t('dashboard.go_to_workouts')} &rarr;</button>
                        </div>

                        <div className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500 dark:border-purple-600">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.my_clients')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.manage_users')}</p>
                            <div className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                                <p>• User Test (Active)</p>
                                <p>• Client Demo (Pending)</p>
                            </div>
                            <button onClick={() => navigate('/clients')} className="mt-4 text-purple-600 dark:text-purple-500 font-medium hover:underline">{t('dashboard.view_all_clients')} &rarr;</button>
                        </div>

                        <div
                            onClick={() => navigate('/pending-requests')}
                            className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-yellow-500 dark:border-yellow-600"
                        >
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.pending_requests')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.approve_requests')}</p>
                            <button className="text-yellow-600 dark:text-yellow-500 font-medium hover:underline">{t('dashboard.view_requests')} &rarr;</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Client View */}
                        <div className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md border-t-4 border-indigo-500 dark:border-[#d4af37]">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.my_current_plan')}</h3>
                            <div className="bg-indigo-50 dark:bg-[#d4af37]/10 p-4 rounded-md mb-4">
                                <p className="font-bold text-indigo-700 dark:text-[#d4af37]">Gold Membership</p>
                                <p className="text-sm text-indigo-600 dark:text-[#d4af37]/80">Expires in 24 days</p>
                            </div>
                            <button
                                onClick={() => navigate('/my-plan')}
                                className="w-full bg-indigo-600 dark:bg-[#d4af37] text-white dark:text-black py-2 rounded hover:bg-indigo-700 dark:hover:bg-[#b5952f] transition-colors font-semibold"
                            >
                                {t('dashboard.view_plan_details')}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md border-t-4 border-orange-500 dark:border-orange-600">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.todays_workout')}</h3>
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">Upper Body Power</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">45 mins • Intermediate</p>
                            </div>
                            <button
                                onClick={() => navigate('/my-workouts')}
                                className="w-full bg-orange-600 dark:bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors"
                            >
                                {t('dashboard.start_workout')}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md border-t-4 border-teal-500 dark:border-teal-600">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('dashboard.track_progress')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.log_progress_desc')}</p>
                            <button
                                onClick={() => navigate('/progress')}
                                className="w-full bg-teal-600 dark:bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition-colors"
                            >
                                {t('dashboard.log_progress')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
