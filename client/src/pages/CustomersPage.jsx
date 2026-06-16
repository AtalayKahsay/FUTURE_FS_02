import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdGroup, MdEmail, MdPhone, MdAttachMoney } from 'react-icons/md';
import api from '../services/api';
import './CustomersPage.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/leads?status=converted&limit=50')
      .then(({ data }) => setCustomers(data.leads))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalValue = customers.reduce((sum, c) => sum + (c.value || 0), 0);

  return (
    <div className="customers-page">
      {/* Stats */}
      <div className="customers-stats">
        <div className="customers-stat">
          <p className="customers-stat-label">Total Customers</p>
          <p className="customers-stat-value">{customers.length}</p>
        </div>
        <div className="customers-stat">
          <p className="customers-stat-label">Total Value</p>
          <p className="customers-stat-value">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="customers-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="customers-skel" />)}
        </div>
      ) : customers.length === 0 ? (
        <div className="customers-empty">
          <MdGroup size={48} />
          <h3>No customers yet</h3>
          <p>Leads with "converted" status will appear here.</p>
          <Link to="/leads" className="customers-empty-btn">View Leads</Link>
        </div>
      ) : (
        <div className="customers-grid">
          {customers.map(c => (
            <Link key={c._id} to={`/leads/${c._id}`} className="customer-card">
              <div className="customer-avatar">{c.name.charAt(0).toUpperCase()}</div>
              <div className="customer-info">
                <p className="customer-name">{c.name}</p>
                {c.company && <p className="customer-company">{c.company}</p>}
              </div>
              <div className="customer-details">
                <div className="customer-detail">
                  <MdEmail size={13} />
                  <span>{c.email}</span>
                </div>
                {c.phone && (
                  <div className="customer-detail">
                    <MdPhone size={13} />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.value > 0 && (
                  <div className="customer-detail customer-detail--value">
                    <MdAttachMoney size={13} />
                    <span>${c.value.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;