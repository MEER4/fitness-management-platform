import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [notes, setNotes] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const response = await api.get('/progress/me');
            setHistory(response.data);
        } catch (err) {
            console.error("Error fetching progress", err);
            setError("Could not load progress history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            await api.post('/progress/', {
                weight: parseFloat(weight),
                body_fat: parseFloat(bodyFat),
                notes: notes
            });
            setSuccessMsg('Progress logged successfully!');
            setWeight('');
            setBodyFat('');
            setNotes('');
            fetchHistory(); // Refresh list
        } catch (err) {
            console.error("Error logging progress", err);
            setError("Failed to log progress. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-blue-600 hover:underline"
                >
                    &larr; Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Progress</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Log New Entry</h2>
                        {successMsg && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMsg}</div>}
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Body Fat (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={bodyFat}
                                    onChange={(e) => setBodyFat(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Notes</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="How are you feeling?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Save Progress
                            </button>
                        </form>
                    </div>

                    {/* History Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">History</h2>
                        {loading ? (
                            <p className="text-gray-500">Loading history...</p>
                        ) : history.length === 0 ? (
                            <p className="text-gray-500">No progress logs yet.</p>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                {history.map((entry) => (
                                    <div key={entry.id} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-medium text-gray-900">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Weight:</span> <span className="font-semibold">{entry.weight} kg</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Body Fat:</span> <span className="font-semibold">{entry.body_fat}%</span>
                                            </div>
                                        </div>
                                        {entry.notes && (
                                            <p className="text-gray-600 text-sm mt-2 italic">"{entry.notes}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;
