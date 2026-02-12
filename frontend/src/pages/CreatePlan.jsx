import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const CreatePlan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration_months: 1,
        features: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Features usually need to be an array or structured, but backend schema might be simple string or JSON.
            // Let's assume for now it's a simple string or we split by newlines if the backend expects a list.
            // Checking api_plans.py... it uses PlanCreate schema. Let's send as is for now or check schema.
            // Safe bet: send as is, assuming backend handles text or we'll adjust.
            // Actually, let's treat features as a string description for now.

            const payload = {
                title: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration_months)
            };

            await api.post('/plans/', payload);
            toast.success('Plan created successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error creating plan", error);
            const msg = error.response?.data?.detail || "Failed to create plan";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-white dark:bg-[#171717] p-8 rounded-lg shadow-md border dark:border-gray-800">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Create New Plan</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                placeholder="e.g. Gold Membership"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                placeholder="Brief description of the plan..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (one per line)</label>
                            <textarea
                                name="features"
                                value={formData.features}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                placeholder="Access to all machines&#10;Free personal trainer consultation&#10;24/7 Access"
                            ></textarea>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Optional: List the key features of this plan.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Months)</label>
                                <input
                                    type="number"
                                    name="duration_months"
                                    required
                                    min="1"
                                    value={formData.duration_months}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating...' : 'Create Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePlan;
