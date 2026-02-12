import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'; // Assuming heroicons is installed or I'll use text

const CreateWorkout = () => {
    const { t } = useTranslation();
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
            toast.success(t('create_workout.success'));
            navigate('/');
        } catch (error) {
            console.error("Error creating workout", error);
            const msg = error.response?.data?.detail || t('create_workout.error');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8">
                <div className="bg-white dark:bg-[#171717] p-8 rounded-lg shadow-md border dark:border-gray-800">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t('create_workout.title')}</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('create_workout.workout_title')}</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                    placeholder={t('create_workout.workout_title_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('create_workout.difficulty')}</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                >
                                    <option value="beginner">{t('create_workout.beginner')}</option>
                                    <option value="intermediate">{t('create_workout.intermediate')}</option>
                                    <option value="advanced">{t('create_workout.advanced')}</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('create_workout.exercises')}</label>
                                <button
                                    type="button"
                                    onClick={addExercise}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-[#d4af37] dark:hover:text-[#b5952f] font-medium flex items-center transition-colors"
                                >
                                    + {t('create_workout.add_exercise')}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {exercises.map((exercise, index) => (
                                    <div key={index} className="flex gap-4 items-start bg-gray-50 dark:bg-[#262626] p-3 rounded-md border dark:border-gray-700">
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                placeholder={t('create_workout.exercise_name')}
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md text-sm mb-2 md:mb-0 dark:bg-[#171717] dark:border-gray-600 dark:text-white dark:focus:ring-[#d4af37]"
                                                required
                                            />
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="text"
                                                placeholder={t('create_workout.sets')}
                                                value={exercise.sets}
                                                onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-[#171717] dark:border-gray-600 dark:text-white dark:focus:ring-[#d4af37]"
                                                required
                                            />
                                        </div>
                                        <div className="w-20">
                                            <input
                                                type="text"
                                                placeholder={t('create_workout.reps')}
                                                value={exercise.reps}
                                                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md text-sm dark:bg-[#171717] dark:border-gray-600 dark:text-white dark:focus:ring-[#d4af37]"
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

                        <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {t('create_workout.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-[#d4af37] dark:text-black dark:hover:bg-[#b5952f] transition-colors font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('create_workout.saving') : t('create_workout.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkout;
