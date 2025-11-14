import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../../services/maintenanceService';
import { MaintenanceTaskCreateRequest, MaintenanceStatus } from '../../types/maintenance';
import { vehicleService } from '../../services/vehicleService';

const MaintenancePage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MaintenanceTaskCreateRequest>({
    vehicleId: 0,
    title: '',
    description: '',
    status: MaintenanceStatus.OPEN,
    plannedDate: '',
    cost: undefined,
    workshopName: '',
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['maintenanceTasks', page],
    queryFn: () => maintenanceService.getAll(page, 10),
  });

  const { data: vehicles } = useQuery({
    queryKey: ['allVehicles'],
    queryFn: () => vehicleService.getAll(0, 1000),
  });

  const createMutation = useMutation({
    mutationFn: maintenanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      setShowForm(false);
      resetForm();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: MaintenanceStatus }) =>
      maintenanceService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const resetForm = () => {
    setFormData({
      vehicleId: 0,
      title: '',
      description: '',
      status: MaintenanceStatus.OPEN,
      plannedDate: '',
      cost: undefined,
      workshopName: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.OPEN:
        return 'bg-yellow-100 text-yellow-800';
      case MaintenanceStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case MaintenanceStatus.DONE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (tasksLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Maintenance Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Maintenance Task
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Maintenance Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle *
              </label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleId: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={0}>Select a vehicle</option>
                {vehicles?.content.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planned Date
                </label>
                <input
                  type="date"
                  value={formData.plannedDate}
                  onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cost: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workshop Name
              </label>
              <input
                type="text"
                value={formData.workshopName}
                onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
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
          {tasks?.content.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    <strong>Vehicle:</strong> {task.vehicle?.brand} {task.vehicle?.model} -{' '}
                    {task.vehicle?.plateNumber}
                  </p>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    {task.plannedDate && (
                      <span>
                        <strong>Planned:</strong>{' '}
                        {new Date(task.plannedDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.completedDate && (
                      <span>
                        <strong>Completed:</strong>{' '}
                        {new Date(task.completedDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.cost && (
                      <span>
                        <strong>Cost:</strong> ${task.cost.toFixed(2)}
                      </span>
                    )}
                    {task.workshopName && (
                      <span>
                        <strong>Workshop:</strong> {task.workshopName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Created by: {task.createdByEmail}
                  </p>
                </div>
                <div className="ml-4">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        id: task.id,
                        status: e.target.value as MaintenanceStatus,
                      })
                    }
                    className="px-3 py-1 border rounded text-sm"
                  >
                    {Object.values(MaintenanceStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks && tasks.totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={tasks.first}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page + 1} of {tasks.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(tasks.totalPages - 1, p + 1))}
              disabled={tasks.last}
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

export default MaintenancePage;
