import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!vehicle) {
    return <div>Vehicle not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {vehicle.brand} {vehicle.model}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium text-gray-700">Plate Number</dt>
                <dd className="text-gray-900">{vehicle.plateNumber}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Year</dt>
                <dd className="text-gray-900">{vehicle.year}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Type</dt>
                <dd className="text-gray-900">{vehicle.vehicleType}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Fuel Type</dt>
                <dd className="text-gray-900">{vehicle.fuelType}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Capacity</dt>
                <dd className="text-gray-900">{vehicle.capacity} seats</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Current Mileage</dt>
                <dd className="text-gray-900">
                  {vehicle.currentMileage.toLocaleString()} km
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Status & Maintenance</h2>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium text-gray-700">Status</dt>
                <dd className="text-gray-900">{vehicle.status}</dd>
              </div>
              {vehicle.departmentOwner && (
                <div>
                  <dt className="font-medium text-gray-700">Department</dt>
                  <dd className="text-gray-900">{vehicle.departmentOwner}</dd>
                </div>
              )}
              {vehicle.lastServiceDate && (
                <div>
                  <dt className="font-medium text-gray-700">Last Service</dt>
                  <dd className="text-gray-900">
                    {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {vehicle.nextServiceDue && (
                <div>
                  <dt className="font-medium text-gray-700">Next Service Due</dt>
                  <dd className="text-gray-900">
                    {new Date(vehicle.nextServiceDue).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;

