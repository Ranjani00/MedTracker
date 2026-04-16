import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import SearchMedicine from './pages/SearchMedicine';
import FindMedicine from './pages/FindMedicine';
import Favorites from './pages/Favorites';
import MyOrders from './pages/MyOrders';
import Subscriptions from './pages/Subscriptions';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Emergency from './pages/Emergency';
import Prescriptions from './pages/Prescriptions';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import DailyTracker from './pages/DailyTracker';
import AIAssistant from './pages/AIAssistant';
import Pharmacies from './pages/Pharmacies';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMedicines from './pages/admin/AdminMedicines';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';
import AdminVoiceTrainer from './pages/admin/AdminVoiceTrainer';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';

function PrivateRoute({ children, adminOnly }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* User routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="search-medicine" element={<SearchMedicine />} />
          <Route path="find-medicine" element={<FindMedicine />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="donations" element={<Donations />} />
          <Route path="requests" element={<Requests />} />
          <Route path="daily-tracker" element={<DailyTracker />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="pharmacies" element={<Pharmacies />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="medicines" element={<AdminMedicines />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="voice-trainer" element={<AdminVoiceTrainer />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
