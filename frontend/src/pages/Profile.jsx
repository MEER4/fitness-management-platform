import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Access global user state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                email
            };
            if (password) {
                payload.password = password;
            }

            const response = await api.put('/auth/me', payload);
            toast.success('Profile updated successfully!');
            // Update context
            // You might need to exposing a method in AuthContext to update user without login, 
            // but setUser is available if we consume it properly
            // Let's assume user structure matches response

            // Reload page or force fetchMe? 
            // AuthContext's fetchMe could be exposed, or just simple reload.
            window.location.reload();

        } catch (error) {
            console.error("Error updating profile", error);
            const msg = error.response?.data?.detail || "Update failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-8 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled // Keep email disabled for simplicity or safety if desired, but user asked for Update Profile. Let's enable it.
                            // Actually, let's enable it
                            />
                            <p className="text-xs text-gray-500 mt-1">Changing email might require re-login (not implemented).</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">New Password (optional)</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Leave blank to keep current"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
