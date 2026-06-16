import { useState, useEffect } from 'react';
import { MdNotifications, MdPeople, MdCheckCircle, MdClose } from 'react-icons/md';
import api from '../services/api';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leads?limit=20&sort=-createdAt')
      .then(({ data }) => setLeads(data.leads))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const notifications = leads.map(lead => ({
    id: lead._id,
    message: `New lead "${lead.name}" was added`,
    sub: `Source: ${lead.source.replace(/_/g, ' ')} · Status: ${lead.status}`,
    time: new Date(lead.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }),
    icon: lead.status === 'converted' ? MdCheckCircle : MdPeople,
    color: lead.status === 'converted' ? 'var(--color-converted)' : 'var(--color-primary)',
    bg: lead.status === 'converted' ? 'var(--color-converted-bg)' : 'var(--color-primary-bg)',
  }));

  return (
    <div className="notif-page">
      <div className="notif-header">
        <p className="notif-count">{notifications.length} notifications</p>
      </div>
      {loading ? (
        <div className="notif-loading">
          {[...Array(5)].map((_, i) => <div key={i} className="notif-skel" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="notif-empty">
          <MdNotifications size={48} />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="notif-item">
                <div className="notif-icon" style={{ background: n.bg, color: n.color }}>
                  <Icon size={20} />
                </div>
                <div className="notif-body">
                  <p className="notif-message">{n.message}</p>
                  <p className="notif-sub">{n.sub}</p>
                </div>
                <span className="notif-time">{n.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;