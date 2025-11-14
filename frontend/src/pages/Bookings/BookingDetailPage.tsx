import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../../services/bookingService';
import { BookingStatus, CheckoutRequest, CheckinRequest } from '../../types/booking';
import { useState } from 'react';

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutRequest>({
    startMileage: 0,
    startFuelLevel: 0,
    checkoutComments: '',
  });
  const [checkinData, setCheckinData] = useState<CheckinRequest>({
    endMileage: 0,
    endFuelLevel: 0,
    damageReported: false,
    checkinComments: '',
  });

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(Number(id)),
    enabled: !!id,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time status updates
  });

  const checkoutMutation = useMutation({
    mutationFn: (data: CheckoutRequest) => bookingService.checkout(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowCheckout(false);
      alert('Vehicle checked out successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to checkout vehicle');
    },
  });

  const checkinMutation = useMutation({
    mutationFn: (data: CheckinRequest) => bookingService.checkin(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowCheckin(false);
      alert('Vehicle checked in successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to checkin vehicle');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingService.cancel(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      alert('Booking cancelled successfully!');
      navigate('/bookings');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <button
            onClick={() => navigate('/bookings')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Back to Bookings
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading booking. Please try again.
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <button
            onClick={() => navigate('/bookings')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Back to Bookings
          </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Booking not found.
        </div>
      </div>
    );
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <button
          onClick={() => navigate('/bookings')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Back to Bookings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="font-medium text-gray-700">Vehicle</dt>
              <dd className="text-gray-900">
                {booking.vehicle?.brand} {booking.vehicle?.model} - {booking.vehicle?.plateNumber}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Status</dt>
              <dd>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Start Date & Time</dt>
              <dd className="text-gray-900">
                {new Date(booking.startDateTime).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">End Date & Time</dt>
              <dd className="text-gray-900">
                {new Date(booking.endDateTime).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Pickup Location</dt>
              <dd className="text-gray-900">{booking.pickupLocation}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Return Location</dt>
              <dd className="text-gray-900">{booking.returnLocation}</dd>
            </div>
            {booking.purpose && (
              <div>
                <dt className="font-medium text-gray-700">Purpose</dt>
                <dd className="text-gray-900">{booking.purpose}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-700">Booked By</dt>
              <dd className="text-gray-900">
                {booking.userName} ({booking.userEmail})
              </dd>
            </div>
            {booking.approverEmail && (
              <div>
                <dt className="font-medium text-gray-700">Approved By</dt>
                <dd className="text-gray-900">{booking.approverEmail}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-gray-700">Created At</dt>
              <dd className="text-gray-900">
                {new Date(booking.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Last Updated</dt>
              <dd className="text-gray-900">
                {new Date(booking.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        {booking.usage && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Usage Details</h2>
            <dl className="space-y-3">
              {booking.usage.startMileage && (
                <div>
                  <dt className="font-medium text-gray-700">Start Mileage</dt>
                  <dd className="text-gray-900">
                    {booking.usage.startMileage.toLocaleString()} km
                  </dd>
                </div>
              )}
              {booking.usage.endMileage && (
                <div>
                  <dt className="font-medium text-gray-700">End Mileage</dt>
                  <dd className="text-gray-900">
                    {booking.usage.endMileage.toLocaleString()} km
                  </dd>
                </div>
              )}
              {booking.usage.distanceTravelled && (
                <div>
                  <dt className="font-medium text-gray-700">Distance Travelled</dt>
                  <dd className="text-gray-900">
                    {booking.usage.distanceTravelled.toLocaleString()} km
                  </dd>
                </div>
              )}
              {booking.usage.startFuelLevel && (
                <div>
                  <dt className="font-medium text-gray-700">Start Fuel Level</dt>
                  <dd className="text-gray-900">{booking.usage.startFuelLevel}%</dd>
                </div>
              )}
              {booking.usage.endFuelLevel && (
                <div>
                  <dt className="font-medium text-gray-700">End Fuel Level</dt>
                  <dd className="text-gray-900">{booking.usage.endFuelLevel}%</dd>
                </div>
              )}
              {booking.usage.damageReported && (
                <div>
                  <dt className="font-medium text-gray-700">Damage Reported</dt>
                  <dd className="text-red-600">Yes</dd>
                  {booking.usage.damageDescription && (
                    <dd className="text-gray-600 text-sm mt-1">
                      {booking.usage.damageDescription}
                    </dd>
                  )}
                </div>
              )}
              {booking.usage.checkoutComments && (
                <div>
                  <dt className="font-medium text-gray-700">Checkout Comments</dt>
                  <dd className="text-gray-900">{booking.usage.checkoutComments}</dd>
                </div>
              )}
              {booking.usage.checkinComments && (
                <div>
                  <dt className="font-medium text-gray-700">Checkin Comments</dt>
                  <dd className="text-gray-900">{booking.usage.checkinComments}</dd>
                </div>
              )}
              {booking.usage.checkedOutAt && (
                <div>
                  <dt className="font-medium text-gray-700">Checked Out At</dt>
                  <dd className="text-gray-900">
                    {new Date(booking.usage.checkedOutAt).toLocaleString()}
                  </dd>
                </div>
              )}
              {booking.usage.checkedInAt && (
                <div>
                  <dt className="font-medium text-gray-700">Checked In At</dt>
                  <dd className="text-gray-900">
                    {new Date(booking.usage.checkedInAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex gap-4">
          {booking.status === BookingStatus.APPROVED && !booking.usage?.checkedOutAt && (
            <button
              onClick={() => setShowCheckout(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Checkout
            </button>
          )}
          {booking.usage?.checkedOutAt && !booking.usage?.checkedInAt && (
            <button
              onClick={() => setShowCheckin(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Checkin
            </button>
          )}
          {(booking.status === BookingStatus.PENDING ||
            booking.status === BookingStatus.APPROVED) && (
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {showCheckout && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Checkout Vehicle</h3>
          {booking.vehicle && (
            <p className="text-sm text-gray-600 mb-4">
              Current Vehicle Mileage: {booking.vehicle.currentMileage.toLocaleString()} km
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (checkoutData.startMileage < 0) {
                alert('Mileage cannot be negative');
                return;
              }
              if (checkoutData.startFuelLevel < 0 || checkoutData.startFuelLevel > 100) {
                alert('Fuel level must be between 0 and 100');
                return;
              }
              checkoutMutation.mutate(checkoutData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Mileage (km) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={checkoutData.startMileage || booking.vehicle?.currentMileage || 0}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, startMileage: Number(e.target.value) })
                }
                placeholder={booking.vehicle?.currentMileage?.toString() || '0'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Fuel Level (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.1"
                value={checkoutData.startFuelLevel}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, startFuelLevel: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                value={checkoutData.checkoutComments}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, checkoutComments: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={checkoutMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {checkoutMutation.isPending ? 'Processing...' : 'Checkout'}
              </button>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showCheckin && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Checkin Vehicle</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (checkinData.endMileage < 0) {
                alert('Mileage cannot be negative');
                return;
              }
              if (checkinData.endMileage < (booking.usage?.startMileage || 0)) {
                alert('End mileage cannot be less than start mileage');
                return;
              }
              if (checkinData.endFuelLevel < 0 || checkinData.endFuelLevel > 100) {
                alert('Fuel level must be between 0 and 100');
                return;
              }
              checkinMutation.mutate(checkinData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Mileage (km) *
              </label>
              {booking.usage?.startMileage && (
                <p className="text-xs text-gray-500 mb-1">
                  Start mileage: {booking.usage.startMileage.toLocaleString()} km
                </p>
              )}
              <input
                type="number"
                required
                min={booking.usage?.startMileage || 0}
                value={checkinData.endMileage}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, endMileage: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {booking.usage?.startMileage && checkinData.endMileage > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Distance: {(checkinData.endMileage - booking.usage.startMileage).toLocaleString()} km
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Fuel Level (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.1"
                value={checkinData.endFuelLevel}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, endFuelLevel: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkinData.damageReported}
                  onChange={(e) =>
                    setCheckinData({ ...checkinData, damageReported: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Damage Reported</span>
              </label>
            </div>
            {checkinData.damageReported && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Damage Description
                </label>
                <textarea
                  value={checkinData.damageDescription || ''}
                  onChange={(e) =>
                    setCheckinData({ ...checkinData, damageDescription: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                value={checkinData.checkinComments}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, checkinComments: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={checkinMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {checkinMutation.isPending ? 'Processing...' : 'Checkin'}
              </button>
              <button
                type="button"
                onClick={() => setShowCheckin(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingDetailPage;

