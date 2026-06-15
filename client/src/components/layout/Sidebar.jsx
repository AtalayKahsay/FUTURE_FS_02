import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdPeople, MdPersonOutline, MdLogout, MdClose } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { to: '/leads',     label: 'Leads',     icon: MdPeople },
  { to: '/profile',   label: 'Profile',   icon: MdPersonOutline },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
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

      <nav className="sidebar__nav">
        <p className="sidebar__section-label">Menu</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
          >
            <Icon size={20} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>

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