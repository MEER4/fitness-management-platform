import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const MyPlan = () => {
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Active Plan</h1>

                {subscriptions.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Active Plan</h2>
                        <p className="text-gray-500 mb-6">You don't have any active subscriptions properly.</p>
                        <button
                            onClick={() => window.location.href = '/browse-plans'} // Simple nav for now or use navigate hook
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Browse Plans
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">ACTIVE</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{sub.plan?.title || "Unknown Plan"}</h2>
                                <p className="text-gray-600 mb-4">{sub.plan?.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-md">
                                    <div>
                                        <p className="text-gray-500">Price</p>
                                        <p className="font-semibold text-lg">${sub.plan?.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Renews On</p>
                                        {/* Mock date logic since we didn't fully implement exp dates yet maybe */}
                                        <p className="font-semibold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
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
