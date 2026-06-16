import { useLocation, Link } from 'react-router-dom';
import { MdMenu, MdAdd } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const PAGE_TITLES = {
  '/dashboard':     { title: 'Dashboard',     sub: 'Overview of your leads pipeline' },
  '/leads/add':     { title: 'Add Lead',       sub: 'Create a new lead' },
  '/leads':         { title: 'Leads',          sub: 'Manage your client leads' },
  '/customers':     { title: 'Customers',      sub: 'Converted leads and clients' },
  '/deals':         { title: 'Deals',          sub: 'Track your sales pipeline' },
  '/tasks':         { title: 'Tasks',          sub: 'Your to-do list and follow-ups' },
  '/analytics':     { title: 'Analytics',      sub: 'Performance insights and reports' },
  '/notifications': { title: 'Notifications',  sub: 'Recent activity and alerts' },
  '/settings':      { title: 'Settings',       sub: 'System configuration' },
  '/admin':         { title: 'Admin Panel',    sub: 'Manage users and roles' },
  '/profile':       { title: 'Profile',        sub: 'Your account settings' },
};

const getPageInfo = (pathname) => {
  if (pathname.includes('/edit')) return { title: 'Edit Lead', sub: 'Update lead info' };
  if (pathname.match(/\/leads\/[^/]+$/)) return { title: 'Lead Detail', sub: 'Full lead information' };
  for (const key of Object.keys(PAGE_TITLES)) {
    if (pathname.startsWith(key)) return PAGE_TITLES[key];
  }
  return { title: 'Mini CRM', sub: '' };
};

const Header = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const pageInfo = getPageInfo(pathname);
  const showAdd = pathname === '/leads' || pathname === '/dashboard';

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <MdMenu size={22} />
        </button>
        <div>
          <h1 className="header__title">{pageInfo.title}</h1>
          {pageInfo.sub && <p className="header__sub">{pageInfo.sub}</p>}
        </div>
      </div>
      <div className="header__right">
        {showAdd && (
          <Link to="/leads/add" className="header__add-btn">
            <MdAdd size={18} /><span>Add Lead</span>
          </Link>
        )}
        <div className="header__user">
          <div className="header__avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <span className="header__user-name">Hi, {user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;