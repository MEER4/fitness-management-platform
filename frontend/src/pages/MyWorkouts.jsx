import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const MyWorkouts = () => {
    const [userWorkouts, setUserWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await api.get('/user-workouts/me');
                setUserWorkouts(response.data);
            } catch (error) {
                console.error("Error fetching workouts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Assigned Workouts</h1>

                {userWorkouts.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-500 mb-4">You haven't been assigned any workouts yet.</p>
                        <p className="text-sm text-gray-400">Ask your coach to assign a plan!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userWorkouts.map(uw => {
                            // Backend returns UserWorkout object which has 'workout' relationship
                            const workout = uw.workout;
                            return (
                                <div key={uw.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-indigo-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{workout.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${workout.level === 'beginner' ? 'bg-green-100 text-green-800' :
                                                workout.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {workout.level.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">Assigned: {new Date(uw.assigned_at).toLocaleDateString()}</p>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Description/Instructions:</h4>
                                        <p className="text-gray-600 text-sm whitespace-pre-line">{workout.description}</p>
                                    </div>

                                    <button
                                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                                    // For MVP, we can just show details here or navigate if complex. 
                                    // Since description contains exercises formatted, we displaying it above.
                                    >
                                        Start Workout
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWorkouts;
