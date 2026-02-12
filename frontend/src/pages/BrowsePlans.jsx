import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BrowsePlans = () => {
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
            toast.success("Plan requested! Waiting for coach approval.");
        } catch (error) {
            console.error("Error requesting plan", error);
            toast.error("Failed to request plan.");
        }
    };

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Plans</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-t-4 border-blue-500 flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.title}</h2>
                            <p className="text-3xl font-bold text-blue-600 mb-4">${plan.price}</p>
                            <div className="flex-grow">
                                <p className="text-gray-600 mb-4 whitespace-pre-line">{plan.description}</p>
                                <p className="text-sm text-gray-500 mb-6">Duration: {plan.duration} days</p>
                            </div>
                            <button
                                onClick={() => handleRequestPlan(plan.id)}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
                            >
                                Request Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowsePlans;
