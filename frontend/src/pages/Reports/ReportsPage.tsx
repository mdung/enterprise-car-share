import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { ReportDto } from '../../types/report';

interface ReportDto {
  periodStart: string;
  periodEnd: string;
  totalBookings: number;
  totalDistance: number;
  estimatedFuelUsage: number;
  totalVehicles: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
}

const ReportsPage = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: report, isLoading } = useQuery({
    queryKey: ['usageReport', startDate, endDate],
    queryFn: async () => {
      const response = await apiClient.get<ReportDto>('/reports/usage', {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Usage Report</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{report.totalBookings}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Total Distance</h3>
              <p className="text-3xl font-bold text-green-600">
                {report.totalDistance.toLocaleString()} km
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Estimated Fuel Usage</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {report.estimatedFuelUsage.toFixed(2)} L
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Total Vehicles</h3>
              <p className="text-3xl font-bold text-purple-600">{report.totalVehicles}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Active Vehicles</h3>
              <p className="text-3xl font-bold text-green-600">{report.activeVehicles}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">In Maintenance</h3>
              <p className="text-3xl font-bold text-orange-600">
                {report.vehiclesInMaintenance}
              </p>
            </div>
          </div>
        )}

        {report && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Report Period</h3>
            <p className="text-sm text-gray-600">
              {new Date(report.periodStart).toLocaleDateString()} -{' '}
              {new Date(report.periodEnd).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
