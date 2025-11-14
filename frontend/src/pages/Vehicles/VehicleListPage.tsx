import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import { VehicleType, VehicleStatus } from '../../types/vehicle';

const VehicleListPage = () => {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<VehicleType | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, statusFilter, typeFilter],
    queryFn: () => vehicleService.getAll(page, 10, 'id', 'asc'),
  });

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case VehicleStatus.IN_USE:
        return 'bg-blue-100 text-blue-800';
      case VehicleStatus.MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800';
      case VehicleStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <Link
          to="/bookings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Booking
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VehicleStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              {Object.values(VehicleStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as VehicleType | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              {Object.values(VehicleType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {data?.content.map((vehicle) => (
            <Link
              key={vehicle.id}
              to={`/vehicles/${vehicle.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </h3>
                  <p className="text-gray-600">
                    Plate: {vehicle.plateNumber} | {vehicle.vehicleType} |{' '}
                    {vehicle.fuelType}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mileage: {vehicle.currentMileage.toLocaleString()} km
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={data.first}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page + 1} of {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
              disabled={data.last}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleListPage;

