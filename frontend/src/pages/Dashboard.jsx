import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return <div className="p-8 text-center">Loading user profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user.name || user.email}!</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold capitalize">
                    {user.role}
                </div>
            </header>

            {user.role === 'coach' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Coach View */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
                        <h3 className="text-xl font-semibold mb-2">Create Plan</h3>
                        <p className="text-gray-500 mb-4">Design new fitness plans for your clients.</p>
                        <button className="text-blue-600 font-medium hover:underline">Go to Plans &rarr;</button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                        <h3 className="text-xl font-semibold mb-2">Create Workout</h3>
                        <p className="text-gray-500 mb-4">Build workout routines and exercises.</p>
                        <button className="text-green-600 font-medium hover:underline">Go to Workouts &rarr;</button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
                        <h3 className="text-xl font-semibold mb-2">My Clients</h3>
                        <p className="text-gray-500 mb-4">Manage users and assign routines.</p>
                        <div className="mt-2 text-sm text-gray-400">
                            <p>• User Test (Active)</p>
                            <p>• Client Demo (Pending)</p>
                        </div>
                        <button className="mt-4 text-purple-600 font-medium hover:underline">View All Clients &rarr;</button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Client View */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                        <h3 className="text-xl font-semibold mb-2">My Current Plan</h3>
                        <div className="bg-indigo-50 p-4 rounded-md mb-4">
                            <p className="font-bold text-indigo-700">Gold Membership</p>
                            <p className="text-sm text-indigo-600">Expires in 24 days</p>
                        </div>
                        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">
                            View Plan Details
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
                        <h3 className="text-xl font-semibold mb-2">Today's Workout</h3>
                        <div className="mb-4">
                            <h4 className="font-medium">Upper Body Power</h4>
                            <p className="text-sm text-gray-500">45 mins • Intermediate</p>
                        </div>
                        <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors">
                            Start Workout
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-teal-500">
                        <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                        <p className="text-gray-500 mb-4">Log your weight, body fat, and notes.</p>
                        <button
                            onClick={() => navigate('/progress')}
                            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition-colors"
                        >
                            Log Progress
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
