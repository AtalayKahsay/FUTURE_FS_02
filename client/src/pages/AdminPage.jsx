import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdPerson, MdEmail, MdLock, MdClose } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';
import './AdminPage.css';

const ROLES = ['agent', 'manager', 'admin'];

const AdminPage = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [form, setForm]           = useState({ name:'', email:'', password:'', role:'agent' });
  const [saving, setSaving]       = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch { toast.error('Failed to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name:'', email:'', password:'', role:'agent' });
    setShowModal(true);
  };

  const openEdit = user => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password:'', role: user.role });
    setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) {
        const payload = { name: form.name, email: form.email, role: form.role };
        await api.put(`/users/${editUser._id}`, payload);
        toast.success('User updated!');
      } else {
        await api.post('/auth/users/create', form);
        toast.success('User created!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted.');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  const handleToggleActive = async user => {
    try {
      await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}.`);
      fetchUsers();
    } catch { toast.error('Failed.'); }
  };

  const roleColor = { admin:'#4f46e5', manager:'#f59e0b', agent:'#10b981' };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h2 className="admin-title">User Management</h2>
          <p className="admin-sub">Manage team members and their roles</p>
        </div>
        <button className="admin-add-btn" onClick={openCreate}>
          <MdAdd size={18} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {ROLES.map(role => (
          <div key={role} className="admin-stat-card">
            <p className="admin-stat-label">{role}s</p>
            <p className="admin-stat-value">{users.filter(u => u.role === role).length}</p>
          </div>
        ))}
        <div className="admin-stat-card">
          <p className="admin-stat-label">Total Users</p>
          <p className="admin-stat-value">{users.length}</p>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="admin-loading">
          {[...Array(4)].map((_, i) => <div key={i} className="admin-skel" />)}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th>
                <th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">{user.name.charAt(0).toUpperCase()}</div>
                      <span className="admin-user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="admin-email">{user.email}</td>
                  <td>
                    <span className="admin-role-badge" style={{ background: roleColor[user.role] + '20', color: roleColor[user.role] }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-status-btn ${user.isActive ? 'admin-status-btn--active' : 'admin-status-btn--inactive'}`}
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="admin-date">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn admin-btn--edit" onClick={() => openEdit(user)}><MdEdit size={15} /></button>
                      <button className="admin-btn admin-btn--delete" onClick={() => handleDelete(user._id)}><MdDelete size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editUser ? 'Edit User' : 'Create New User'}</h3>
              <button onClick={() => setShowModal(false)}><MdClose size={20} /></button>
            </div>
            <form className="admin-modal-form" onSubmit={handleSave}>
              <div className="admin-field">
                <label>Full Name</label>
                <div className="admin-input-wrap">
                  <MdPerson className="admin-input-icon" size={16} />
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
                </div>
              </div>
              <div className="admin-field">
                <label>Email Address</label>
                <div className="admin-input-wrap">
                  <MdEmail className="admin-input-icon" size={16} />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com" required />
                </div>
              </div>
              {!editUser && (
                <div className="admin-field">
                  <label>Password</label>
                  <div className="admin-input-wrap">
                    <MdLock className="admin-input-icon" size={16} />
                    <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" required />
                  </div>
                </div>
              )}
              <div className="admin-field">
                <label>Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="admin-modal-save" disabled={saving}>
                  {saving ? 'Saving...' : editUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;