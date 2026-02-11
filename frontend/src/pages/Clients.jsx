import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/auth/clients');
                setClients(response.data);
            } catch (error) {
                console.error("Error fetching clients", error);
                toast.error("Could not load clients.");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Clients</h1>

            {clients.length === 0 ? (
                <p className="text-gray-500">No clients found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <div
                            key={client.id}
                            onClick={() => navigate(`/clients/${client.id}/progress`)}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-500"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                                    {client.name ? client.name.charAt(0).toUpperCase() : client.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{client.name || "Unnamed Client"}</h3>
                                    <p className="text-gray-500 text-sm">{client.email}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                                <span className="text-blue-600 text-sm font-medium hover:underline">View Progress &rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Clients;
