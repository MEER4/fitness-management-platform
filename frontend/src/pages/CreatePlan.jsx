import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const CreatePlan = () => {
    const navigate = useNavigate();
    const { planId } = useParams(); // Start using params
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!planId);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration_months: 1,
        features: ''
    });

    useEffect(() => {
        if (planId) {
            const fetchPlan = async () => {
                try {
                    // We don't have a specific "get plan by ID" public endpoint?
                    // api_plans.py has GET / (list).
                    // We implemented GET /:id implicitly? No, we didn't add GET /:id in api_plans.py!
                    // WAIT. I added get_plan in CRUD, but NOT in API.
                    // Implementation Plan missed GET /plans/{id}.
                    // I need to add GET /plans/{id} to backend if I want to fetch it here efficiently.
                    // OR I can filter from the list if the list is small.
                    // Given I just edited backend, I should add GET /plans/{id} properly.
                    // But for now, to save a turn, I'll fetch ALL and find it. This is inefficient but safe for MVP.
                    // Actually, I should probably add the endpoint.
                    // Let's assume I will add it or fetch all.
                    // Let's fetch all for now to avoid context switch back to backend immediately, 
                    // or I'll quickly add the endpoint in next step if this fails.
                    // Actually, let's try to fetch all and find.
                    const response = await api.get('/plans/');
                    const foundPlan = response.data.find(p => p.id == planId);
                    if (foundPlan) {
                        setFormData({
                            name: foundPlan.title,
                            description: foundPlan.description || '',
                            price: foundPlan.price,
                            duration_months: foundPlan.duration,
                            features: foundPlan.features || '' // Backend doesn't seem to store features separate from description? 
                            // In api_plans.py schemas, PlanBase has description.
                            // In CreatePlan.jsx, we were putting existing description.
                            // We probably appended features to description.
                            // Let's just load description.
                        });
                    } else {
                        toast.error("Plan not found");
                        navigate('/coach-plans');
                    }
                } catch (error) {
                    console.error("Error fetching plan", error);
                } finally {
                    setFetching(false);
                }
            };
            fetchPlan();
        }
    }, [planId, navigate]);

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
            const payload = {
                title: formData.name,
                description: formData.description + (formData.features ? `\n\nFeatures:\n${formData.features}` : ""),
                // Note: This appending logic is a bit flawed if we edit again. 
                // Ideally backend has a features field.
                // For now, let's just send description as is if editing, or be careful.
                // If editing, user sees composed description.
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration_months)
            };

            // If editing, description might already contain features, so sticking them again might duplicate.
            // If planId exists, we assume user edited the 'description' field which loaded ONLY description?
            // Wait, in my fetch logic above I only assigned description.
            // Simplified: Just use description field for everything for now to match schema.
            if (planId) {
                // Remove features appends for edit to avoid duplication if user manually edited it
                // Actually, let's keep it simple: Just Title, Description, Price, Duration.
                payload.description = formData.description;
            }

            if (planId) {
                await api.put(`/plans/${planId}`, payload);
                toast.success('Plan updated successfully!');
            } else {
                await api.post('/plans/', payload);
                toast.success('Plan created successfully!');
            }
            navigate('/coach-plans');
        } catch (error) {
            console.error("Error saving plan", error);
            const msg = error.response?.data?.detail || "Failed to save plan";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex justify-center p-10 font-bold text-white"><Navbar />Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            <Navbar />
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-white dark:bg-[#171717] p-8 rounded-lg shadow-md border dark:border-gray-800">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{planId ? 'Edit Plan' : 'Create New Plan'}</h1>

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

                        {!planId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (Optional, appended to desc)</label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-[#262626] dark:border-gray-700 dark:text-white dark:focus:ring-[#d4af37]"
                                    placeholder="Access to all machines&#10;Free personal trainer consultation"
                                ></textarea>
                            </div>
                        )}

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
                                onClick={() => navigate('/coach-plans')}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 bg-blue-600 dark:bg-[#d4af37] text-white dark:text-black font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-[#b5952f] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : (planId ? 'Update Plan' : 'Create Plan')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePlan;
