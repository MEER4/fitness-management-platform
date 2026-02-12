import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/subscriptions/pending');
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching pending requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.post(`/subscriptions/${id}/approve`);
            toast.success("Request approved!");
            fetchRequests();
        } catch (error) {
            toast.error("Failed to approve request.");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/subscriptions/${id}/reject`);
            toast.success("Request rejected.");
            fetchRequests();
        } catch (error) {
            toast.error("Failed to reject request.");
        }
    };

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Pending Plan Requests</h1>

                {requests.length === 0 ? (
                    <div className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md text-center border dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">No pending requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map(req => (
                            <div key={req.id} className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md flex justify-between items-center border dark:border-gray-800">
                                <div>
                                    {/* Assuming user relationship is loaded, backend might need to ensure eager loading or join */}
                                    {/* The schema defined earlier 'Subscription' has 'plan' optional, but user? */}
                                    {/* Let's assume we need to fetch user details or schema includes user_id. Display ID if name not avail */}
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">User ID: {req.user_id}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Requested Plan ID: {req.plan_id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">Date: {new Date(req.start_date || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleApprove(req.id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingRequests;
