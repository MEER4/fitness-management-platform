import { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const ClientProgress = () => {
    const { clientId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get(`/progress/${clientId}`);
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching client progress", error);
                toast.error("Could not load client progress.");
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchProgress();
        }
    }, [clientId]);

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8">
                <button onClick={() => navigate('/clients')} className="text-gray-600 hover:text-gray-900 mb-4 flex items-center">
                    &larr; Back to Clients
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Client Progress History</h1>

                {history.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <p className="text-gray-500">This client hasn't logged any progress yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((entry) => (
                            <div key={entry.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                                    <div className="flex gap-4 mt-1">
                                        <p className="font-semibold text-gray-800">Weight: <span className="text-blue-600">{entry.weight} kg</span></p>
                                        {entry.body_fat && (
                                            <p className="font-semibold text-gray-800">Body Fat: <span className="text-orange-600">{entry.body_fat}%</span></p>
                                        )}
                                    </div>
                                    {entry.notes && <p className="text-gray-600 italic mt-2 text-sm">"{entry.notes}"</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientProgress;
