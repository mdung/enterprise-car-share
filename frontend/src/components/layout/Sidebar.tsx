import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/user';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Car Share</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded ${
            isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          Dashboard
        </Link>
        
        <Link
          to="/vehicles"
          className={`block px-4 py-2 rounded ${
            isActive('/vehicles') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          Vehicles
        </Link>
        
        <Link
          to="/bookings"
          className={`block px-4 py-2 rounded ${
            isActive('/bookings') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          My Bookings
        </Link>
        
        {hasRole(Role.ROLE_ADMIN) && (
          <>
            <Link
              to="/maintenance"
              className={`block px-4 py-2 rounded ${
                isActive('/maintenance') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Maintenance
            </Link>
            
            <Link
              to="/reports"
              className={`block px-4 py-2 rounded ${
                isActive('/reports') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Reports
            </Link>
          </>
        )}
        
        <Link
          to="/profile"
          className={`block px-4 py-2 rounded ${
            isActive('/profile') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          Profile
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

