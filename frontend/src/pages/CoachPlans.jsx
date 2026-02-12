import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CoachPlans = () => {
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
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Plans</h1>
                    <button
                        onClick={() => navigate('/create-plan')}
                        className="bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors"
                    >
                        Create New Plan
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-[#d4af37]">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{plan.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">{plan.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-blue-600 dark:text-[#d4af37] font-bold">${plan.price}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{plan.duration} days</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoachPlans;
