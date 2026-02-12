import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Clients from './pages/Clients';
import ClientProgress from './pages/ClientProgress';
import CreatePlan from './pages/CreatePlan';
import CreateWorkout from './pages/CreateWorkout';
import MyWorkouts from './pages/MyWorkouts';
import MyPlan from './pages/MyPlan';
import Profile from './pages/Profile';
import CoachPlans from './pages/CoachPlans';
import BrowsePlans from './pages/BrowsePlans';
import PendingRequests from './pages/PendingRequests';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Toaster position="top-right" />
                    <Routes>
                        {/* Public Routes (only for non-authenticated users) */}
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                        </Route>

                        {/* Protected Routes (require authentication) */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Dashboard />} />

                            {/* Example: Only clients can access progress */}
                            <Route element={<ProtectedRoute allowedRoles={['client', 'coach']} />}>
                                <Route path="/progress" element={<Progress />} />
                                <Route path="/profile" element={<Profile />} />
                            </Route>

                            {/* Client Only Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['client']} />}>
                                <Route path="/my-workouts" element={<MyWorkouts />} />
                                <Route path="/my-plan" element={<MyPlan />} />
                                <Route path="/browse-plans" element={<BrowsePlans />} />
                            </Route>

                            {/* Coach Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/clients/:clientId/progress" element={<ClientProgress />} />
                                <Route path="/create-plan" element={<CreatePlan />} />
                                <Route path="/create-workout" element={<CreateWorkout />} />
                                <Route path="/coach-plans" element={<CoachPlans />} />
                                <Route path="/pending-requests" element={<PendingRequests />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App;
