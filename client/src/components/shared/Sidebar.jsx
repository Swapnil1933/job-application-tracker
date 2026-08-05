import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineX,
} from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/jobs', label: 'Applications', icon: HiOutlineBriefcase },
  { path: '/companies', label: 'Companies', icon: HiOutlineOfficeBuilding },
  { path: '/interviews', label: 'Interviews', icon: HiOutlineCalendar },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-white dark:bg-surface-900
          border-r border-surface-200 dark:border-surface-800
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <HiOutlineBriefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">JobTrackr</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden transition-colors"
          >
            <HiOutlineX className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200 dark:border-surface-800">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">
              Track your dream job
            </p>
            <p className="text-xs font-medium gradient-text">
              Stay organized. Stay ahead.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
