import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';
import { VehicleCreateRequest, VehicleType, FuelType, VehicleStatus } from '../../types/vehicle';
import { useNavigate } from 'react-router-dom';

const VehicleManagementPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<number | null>(null);
  const [formData, setFormData] = useState<VehicleCreateRequest>({
    plateNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    vehicleType: VehicleType.CAR,
    fuelType: FuelType.PETROL,
    capacity: 5,
    vin: '',
    departmentOwner: '',
    costCenter: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page],
    queryFn: () => vehicleService.getAll(page, 10, 'id', 'asc'),
  });

  const createMutation = useMutation({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: VehicleCreateRequest }) =>
      vehicleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowForm(false);
      setEditingVehicle(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vehicleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: VehicleStatus }) =>
      vehicleService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const resetForm = () => {
    setFormData({
      plateNumber: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      vehicleType: VehicleType.CAR,
      fuelType: FuelType.PETROL,
      capacity: 5,
      vin: '',
      departmentOwner: '',
      costCenter: '',
    });
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle.id);
    setFormData({
      plateNumber: vehicle.plateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || '',
      vehicleType: vehicle.vehicleType,
      fuelType: vehicle.fuelType,
      capacity: vehicle.capacity,
      vin: vehicle.vin || '',
      departmentOwner: vehicle.departmentOwner || '',
      costCenter: vehicle.costCenter || '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

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
        <h1 className="text-3xl font-bold">Vehicle Management</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Vehicle
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plate Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <select
                  required
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleType: e.target.value as VehicleType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(VehicleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type *
                </label>
                <select
                  required
                  value={formData.fuelType}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelType: e.target.value as FuelType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(FuelType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Owner
                </label>
                <input
                  type="text"
                  value={formData.departmentOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentOwner: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
                <input
                  type="text"
                  value={formData.costCenter}
                  onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {editingVehicle ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVehicle(null);
                  resetForm();
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {data?.content.map((vehicle) => (
            <div
              key={vehicle.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Plate: {vehicle.plateNumber} | {vehicle.vehicleType} | {vehicle.fuelType} |{' '}
                    {vehicle.capacity} seats
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mileage: {vehicle.currentMileage.toLocaleString()} km
                    {vehicle.departmentOwner && ` | Department: ${vehicle.departmentOwner}`}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                    className="px-3 py-1 text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="px-3 py-1 text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                  <select
                    value={vehicle.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        id: vehicle.id,
                        status: e.target.value as VehicleStatus,
                      })
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    {Object.values(VehicleStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this vehicle?')) {
                        deleteMutation.mutate(vehicle.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1 text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
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

export default VehicleManagementPage;

