import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';
import { bookingService } from '../../services/bookingService';
import { BookingCreateRequest } from '../../types/booking';

const BookingCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BookingCreateRequest>({
    vehicleId: 0,
    startDateTime: '',
    endDateTime: '',
    pickupLocation: '',
    returnLocation: '',
    purpose: '',
  });

  const { data: vehicles } = useQuery({
    queryKey: ['availableVehicles'],
    queryFn: () => vehicleService.getAvailable(0, 100),
  });

  const mutation = useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      navigate('/bookings');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Booking</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle *
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a vehicle</option>
            {vehicles?.content.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location *
          </label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Location *
          </label>
          <input
            type="text"
            name="returnLocation"
            value={formData.returnLocation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {mutation.error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {(mutation.error as any).response?.data?.message || 'Failed to create booking'}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating...' : 'Create Booking'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingCreatePage;

