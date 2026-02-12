import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AssignWorkoutModal = ({ client, onClose }) => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState('');
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await api.get('/workouts/');
                setWorkouts(response.data);
                if (response.data.length > 0) {
                    setSelectedWorkout(response.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching workouts", error);
                toast.error("Failed to load workouts.");
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, []);

    const handleAssign = async () => {
        if (!selectedWorkout) {
            toast.error("Please select a workout.");
            return;
        }

        setAssigning(true);
        try {
            await api.post('/user-workouts/', {
                user_id: client.id,
                workout_id: selectedWorkout
            });
            toast.success(`Workout assigned to ${client.name || client.email}`);
            onClose();
        } catch (error) {
            console.error("Error assigning workout", error);
            const msg = error.response?.data?.detail || "Failed to assign workout.";
            toast.error(msg);
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">Assign Workout</h2>
                <p className="text-gray-600 mb-4">
                    Assigning to: <span className="font-semibold text-gray-800">{client.name || client.email}</span>
                </p>

                {loading ? (
                    <div className="text-center py-4">Loading workouts...</div>
                ) : workouts.length === 0 ? (
                    <div className="text-center py-4 text-red-500">
                        No workouts found. Create a workout first.
                    </div>
                ) : (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Workout</label>
                        <select
                            value={selectedWorkout}
                            onChange={(e) => setSelectedWorkout(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            {workouts.map(workout => (
                                <option key={workout.id} value={workout.id}>
                                    {workout.title} ({workout.level})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {workouts.find(w => w.id == selectedWorkout)?.description?.slice(0, 100)}...
                        </p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={assigning || loading || workouts.length === 0}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${assigning ? 'opacity-70' : ''}`}
                    >
                        {assigning ? 'Assigning...' : 'Assign Workout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignWorkoutModal;
