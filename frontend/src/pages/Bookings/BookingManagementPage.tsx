import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { BookingStatus } from '../../types/booking';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/user';

const BookingManagementPage = () => {
  const { hasRole } = useAuth();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('PENDING');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['allBookings', page, statusFilter],
    queryFn: () => bookingService.getAll(page, 10, statusFilter || undefined),
    enabled: hasRole(Role.ROLE_ADMIN) || hasRole(Role.ROLE_APPROVER),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const approveMutation = useMutation({
    mutationFn: bookingService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      alert('Booking approved successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to approve booking');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: bookingService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      alert('Booking rejected successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to reject booking');
    },
  });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading bookings. Please try again.
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Booking Management</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              {Object.values(BookingStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center py-8 text-gray-500">
            No bookings found for the selected filter.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking Management</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            {Object.values(BookingStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {data?.content.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {booking.vehicle?.brand} {booking.vehicle?.model} - {booking.vehicle?.plateNumber}
                    </Link>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    <strong>User:</strong> {booking.userName} ({booking.userEmail})
                  </p>
                  <p className="text-gray-600">
                    <strong>Period:</strong>{' '}
                    {new Date(booking.startDateTime).toLocaleString()} -{' '}
                    {new Date(booking.endDateTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Pickup:</strong> {booking.pickupLocation} |{' '}
                    <strong>Return:</strong> {booking.returnLocation}
                  </p>
                  {booking.purpose && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Purpose:</strong> {booking.purpose}
                    </p>
                  )}
                  {booking.approverEmail && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Approved by:</strong> {booking.approverEmail}
                    </p>
                  )}
                </div>
                {booking.status === BookingStatus.PENDING && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => approveMutation.mutate(booking.id)}
                      disabled={approveMutation.isPending}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(booking.id)}
                      disabled={rejectMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
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

export default BookingManagementPage;

