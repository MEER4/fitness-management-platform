import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Clients from './pages/Clients';
import ClientProgress from './pages/ClientProgress';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
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
                        </Route>

                        {/* Coach Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
                            <Route path="/clients" element={<Clients />} />
                            <Route path="/clients/:clientId/progress" element={<ClientProgress />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App;
