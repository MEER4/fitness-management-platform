import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'; // Assuming heroicons is installed or I'll use text

const CreateWorkout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState('beginner');
    const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '' }]);

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '' }]);
    };

    const removeExercise = (index) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Serialize exercises into description
            const description = exercises.map(ex =>
                `- ${ex.name}: ${ex.sets} sets x ${ex.reps} reps`
            ).join('\n');

            const payload = {
                title,
                level,
                description
            };

            await api.post('/workouts/', payload);
            toast.success('Workout created successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error creating workout", error);
            const msg = error.response?.data?.detail || "Failed to create workout";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Workout</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Workout Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Full Body Blast"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Exercises</label>
                                <button
                                    type="button"
                                    onClick={addExercise}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                >
                                    + Add Exercise
                                </button>
                            </div>

                            <div className="space-y-3">
                                {exercises.map((exercise, index) => (
                                    <div key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded-md">
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                placeholder="Exercise Name"
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md text-sm mb-2 md:mb-0"
                                                required
                                            />
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="text"
                                                placeholder="Sets"
                                                value={exercise.sets}
                                                onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="text"
                                                placeholder="Reps"
                                                value={exercise.reps}
                                                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md text-sm"
                                                required
                                            />
                                        </div>
                                        {exercises.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeExercise(index)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : 'Create Workout'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkout;
