import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <dl className="space-y-4">
          <div>
            <dt className="font-medium text-gray-700">Email</dt>
            <dd className="text-gray-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Name</dt>
            <dd className="text-gray-900">
              {user?.firstName} {user?.lastName}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Department</dt>
            <dd className="text-gray-900">{user?.department || 'N/A'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Cost Center</dt>
            <dd className="text-gray-900">{user?.costCenter || 'N/A'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Role</dt>
            <dd className="text-gray-900">{user?.role}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfilePage;

