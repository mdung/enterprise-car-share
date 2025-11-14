import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import VehicleListPage from '../pages/Vehicles/VehicleListPage';
import VehicleDetailPage from '../pages/Vehicles/VehicleDetailPage';
import VehicleManagementPage from '../pages/Vehicles/VehicleManagementPage';
import MyBookingsPage from '../pages/Bookings/MyBookingsPage';
import BookingCreatePage from '../pages/Bookings/BookingCreatePage';
import BookingDetailPage from '../pages/Bookings/BookingDetailPage';
import BookingManagementPage from '../pages/Bookings/BookingManagementPage';
import MaintenancePage from '../pages/Maintenance/MaintenancePage';
import ReportsPage from '../pages/Reports/ReportsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import MainLayout from '../components/layout/MainLayout';
import { Role } from '../types/user';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/vehicles',
        element: <VehicleListPage />,
      },
      {
        path: '/vehicles/:id',
        element: <VehicleDetailPage />,
      },
      {
        path: '/vehicles/manage',
        element: (
          <ProtectedRoute requiredRole={Role.ROLE_ADMIN}>
            <VehicleManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/bookings',
        element: <MyBookingsPage />,
      },
      {
        path: '/bookings/new',
        element: <BookingCreatePage />,
      },
      {
        path: '/bookings/:id',
        element: <BookingDetailPage />,
      },
      {
        path: '/bookings/manage',
        element: (
          <ProtectedRoute>
            <BookingManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/maintenance',
        element: (
          <ProtectedRoute requiredRole={Role.ROLE_ADMIN}>
            <MaintenancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute requiredRole={Role.ROLE_ADMIN}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;

