import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

import AssignWorkoutModal from '../components/AssignWorkoutModal';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningClient, setAssigningClient] = useState(null);
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

    const handleAssignClick = (e, client) => {
        e.stopPropagation();
        setAssigningClient(client);
    };

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Clients</h1>

                {clients.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No clients found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map(client => (
                            <div
                                key={client.id}
                                onClick={() => navigate(`/clients/${client.id}/progress`)}
                                className="bg-white dark:bg-[#171717] p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-500 dark:border-[#d4af37] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-blue-100 text-blue-600 dark:bg-[#d4af37]/20 dark:text-[#d4af37] rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                                            {client.name ? client.name.charAt(0).toUpperCase() : client.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{client.name || "Unnamed Client"}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">{client.email}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">Active</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-t dark:border-gray-700 pt-4">
                                    <button
                                        onClick={(e) => handleAssignClick(e, client)}
                                        className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-[#d4af37] dark:hover:bg-[#b5952f] dark:text-black font-semibold px-3 py-1 rounded-md text-sm transition-colors"
                                    >
                                        Assign Workout
                                    </button>
                                    <span className="text-blue-600 dark:text-[#d4af37] text-sm font-medium hover:underline">View Progress &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {assigningClient && (
                    <AssignWorkoutModal
                        client={assigningClient}
                        onClose={() => setAssigningClient(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Clients;
