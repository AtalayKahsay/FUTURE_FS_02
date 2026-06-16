import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdPeople, MdPersonOutline, MdLogout, MdClose, MdBarChart, MdHandshake, MdCheckCircle, MdNotifications, MdSettings, MdAdminPanelSettings, MdGroup
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  // Build nav based on role
  const navSections = [
    {
      label: 'Main',
      items: [
        { to: '/dashboard',     label: 'Dashboard',     icon: MdDashboard,   roles: ['admin','manager','agent'] },
        { to: '/leads',         label: 'Leads',         icon: MdPeople,      roles: ['admin','manager','agent'] },
        { to: '/customers',     label: 'Customers',     icon: MdGroup,       roles: ['admin','manager','agent'] },
        { to: '/deals',         label: 'Deals',         icon: MdHandshake,   roles: ['admin','manager','agent'] },
        { to: '/tasks',         label: 'Tasks',         icon: MdCheckCircle, roles: ['admin','manager','agent'] },
      ]
    },
    {
      label: 'Insights',
      items: [
        { to: '/analytics',     label: 'Analytics',     icon: MdBarChart,          roles: ['admin','manager'] },
        { to: '/notifications', label: 'Notifications', icon: MdNotifications,     roles: ['admin','manager','agent'] },
      ]
    },
    {
      label: 'System',
      items: [
        { to: '/settings',      label: 'Settings',      icon: MdSettings,          roles: ['admin','manager'] },
        { to: '/admin',         label: 'Admin Panel',   icon: MdAdminPanelSettings, roles: ['admin'] },
        { to: '/profile',       label: 'Profile',       icon: MdPersonOutline,     roles: ['admin','manager','agent'] },
      ]
    }
  ];

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">C</div>
        <div>
          <p className="sidebar__brand-name">Mini CRM</p>
          <p className="sidebar__brand-tag">Lead Manager</p>
        </div>
        <button className="sidebar__close" onClick={onClose}>
          <MdClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navSections.map(section => {
          const visibleItems = section.items.filter(item =>
            item.roles.includes(user?.role)
          );
          if (!visibleItems.length) return null;
          return (
            <div key={section.label}>
              <p className="sidebar__section-label">{section.label}</p>
              {visibleItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                  }
                >
                  <Icon size={20} /><span>{label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <div className="sidebar__avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">{user?.name}</span>
          <span className="sidebar__user-role">{user?.role}</span>
        </div>
        <button className="sidebar__logout" onClick={handleLogout}>
          <MdLogout size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;