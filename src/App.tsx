import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Users from './pages/Users';
import User from './pages/User';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import AssetsManagement from './pages/AssetsManagement';
import Asset from './pages/Asset';
import Packages from './pages/Packages';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import ScheduledActivities from './pages/ScheduledActivities';
import Queues from './pages/Queues';
import Device from './pages/Device';
import Automation from './pages/Automation';
import Project from './pages/Project';
import Execution from './pages/Execution';
import Schedule from './pages/Schedule';
import Machine from './pages/Machine';
import PackagesUpload from './pages/PackagesUpload';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';
import ModalProvider from './components/modals/ModalProvider';

function App() {
  return (
    <BrowserRouter>
      <Notification />
      <ModalProvider />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/create" element={<User />} />
          <Route path="users/:id" element={<User />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="permissions/:id" element={<Permissions />} />
          <Route path="assets" element={<AssetsManagement />} />
          <Route path="assets/create" element={<Asset />} />
          <Route path="assets/:id" element={<Asset />} />
          <Route path="packages" element={<Packages />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="job-details/:id" element={<JobDetails />} />
          <Route path="scheduled" element={<ScheduledActivities />} />
          <Route path="scheduled/create" element={<Schedule />} />
          <Route path="scheduled/:id" element={<Schedule />} />
          <Route path="queues" element={<Queues />} />
          <Route path="machines" element={<Device />} />
          <Route path="machine/create" element={<Machine />} />
          <Route path="machine/:id" element={<Machine />} />
          <Route path="packages/upload" element={<PackagesUpload />} />
          <Route path="automation" element={<Automation />} />
          <Route path="project" element={<Project />} />
          <Route path="project/:id" element={<Project />} />
          <Route path="execution" element={<Execution />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
