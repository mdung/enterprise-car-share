import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { BookingStatus } from '../../types/booking';

const MyBookingsPage = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['myBookings', page],
    queryFn: () => bookingService.getMyBookings(page, 10),
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Link
          to="/bookings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Booking
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {data?.content.map((booking) => (
            <Link
              key={booking.id}
              to={`/bookings/${booking.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {booking.vehicle?.brand} {booking.vehicle?.model}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(booking.startDateTime).toLocaleString()} -{' '}
                    {new Date(booking.endDateTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Pickup: {booking.pickupLocation} | Return:{' '}
                    {booking.returnLocation}
                  </p>
                  {booking.purpose && (
                    <p className="text-sm text-gray-600 mt-1">
                      Purpose: {booking.purpose}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
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

export default MyBookingsPage;

