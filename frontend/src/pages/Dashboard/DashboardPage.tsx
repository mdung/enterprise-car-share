import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../services/vehicleService';
import { bookingService } from '../../services/bookingService';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: vehicles } = useQuery({
    queryKey: ['availableVehicles'],
    queryFn: () => vehicleService.getAvailable(0, 5),
  });

  const { data: bookings } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingService.getMyBookings(0, 5),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Available Vehicles</h3>
          <p className="text-3xl font-bold text-blue-600">
            {vehicles?.totalElements || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
          <p className="text-3xl font-bold text-green-600">
            {bookings?.totalElements || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Role</h3>
          <p className="text-lg text-gray-600">{user?.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Vehicles</h3>
            <Link
              to="/vehicles"
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {vehicles?.content.slice(0, 5).map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-medium">
                  {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
                </p>
                <p className="text-sm text-gray-600">{vehicle.vehicleType}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <Link
              to="/bookings"
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {bookings?.content.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="p-3 border rounded hover:bg-gray-50"
              >
                <p className="font-medium">
                  {booking.vehicle?.brand} {booking.vehicle?.model}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(booking.startDateTime).toLocaleDateString()} -{' '}
                  {new Date(booking.endDateTime).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                    booking.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

