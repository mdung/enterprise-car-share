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

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(Number(id)),
    enabled: !!id,
  });

  const checkoutMutation = useMutation({
    mutationFn: (data: CheckoutRequest) => bookingService.checkout(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      setShowCheckout(false);
    },
  });

  const checkinMutation = useMutation({
    mutationFn: (data: CheckinRequest) => bookingService.checkin(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      setShowCheckin(false);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingService.cancel(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      navigate('/bookings');
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              checkoutMutation.mutate(checkoutData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Mileage *
              </label>
              <input
                type="number"
                required
                value={checkoutData.startMileage}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, startMileage: Number(e.target.value) })
                }
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
              checkinMutation.mutate(checkinData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Mileage *
              </label>
              <input
                type="number"
                required
                value={checkinData.endMileage}
                onChange={(e) =>
                  setCheckinData({ ...checkinData, endMileage: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
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

