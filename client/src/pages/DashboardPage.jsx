import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdPeople, MdFiberNew, MdPhone, MdCheckCircle, MdTrendingUp, MdArrowForward } from 'react-icons/md';
import api from '../services/api';
import StatusBadge from '../components/leads/StatusBadge';
import './DashboardPage.css';

const STAT_CARDS = [
  { key:'total',     label:'Total Leads', icon:MdPeople,      color:'primary' },
  { key:'new',       label:'New',         icon:MdFiberNew,    color:'new' },
  { key:'contacted', label:'Contacted',   icon:MdPhone,       color:'contacted' },
  { key:'converted', label:'Converted',   icon:MdCheckCircle, color:'converted' },
];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-skel"/>
      <div className="dash-skel dash-skel--s"/>
    </div>
  );

  const maxM = stats?.monthlyLeads?.length ? Math.max(...stats.monthlyLeads.map(m => m.count), 1) : 1;
  const maxS = stats?.sourceStats?.length  ? Math.max(...stats.sourceStats.map(s => s.count), 1)  : 1;

  return (
    <div className="dashboard">
      <section className="dashboard__stats">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className={`stat-card stat-card--${color}`}>
            <div className="stat-card__icon"><Icon size={22}/></div>
            <div className="stat-card__body">
              <p className="stat-card__label">{label}</p>
              <p className="stat-card__value">{stats?.[key] ?? '—'}</p>
            </div>
            {key === 'total' && (
              <div className="stat-card__rate">
                <MdTrendingUp size={14}/><span>{stats?.conversionRate}% converted</span>
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="dashboard__charts">
        <div className="chart-card">
          <h3 className="chart-card__title">Monthly Lead Trend</h3>
          <p className="chart-card__sub">Last 6 months</p>
          <div className="bar-chart">
            {stats?.monthlyLeads?.length > 0 ? stats.monthlyLeads.map(m => (
              <div key={`${m._id.year}-${m._id.month}`} className="bar-chart__col">
                <div className="bar-chart__bar-wrap">
                  <div className="bar-chart__bar" style={{ height:`${(m.count/maxM)*100}%` }}>
                    <span className="bar-chart__val">{m.count}</span>
                  </div>
                </div>
                <span className="bar-chart__label">{MONTHS[m._id.month - 1]}</span>
              </div>
            )) : <p className="chart-empty">No data yet</p>}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card__title">Lead Sources</h3>
          <p className="chart-card__sub">Where leads come from</p>
          <div className="source-list">
            {stats?.sourceStats?.length > 0 ? stats.sourceStats.map(s => (
              <div key={s._id} className="source-item">
                <div className="source-item__header">
                  <span className="source-item__name">{s._id.replace(/_/g, ' ')}</span>
                  <span className="source-item__count">{s.count}</span>
                </div>
                <div className="source-item__track">
                  <div className="source-item__fill" style={{ width:`${(s.count/maxS)*100}%` }}/>
                </div>
              </div>
            )) : <p className="chart-empty">No source data yet</p>}
          </div>
        </div>
      </div>

      <div className="recent-leads">
        <div className="recent-leads__header">
          <h3 className="recent-leads__title">Recent Leads</h3>
          <Link to="/leads" className="recent-leads__link">View all <MdArrowForward size={16}/></Link>
        </div>
        {stats?.recentLeads?.length > 0 ? (
          <div className="recent-table-wrap">
            <table className="recent-table">
              <thead><tr><th>Name</th><th>Email</th><th>Source</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {stats.recentLeads.map(lead => (
                  <tr key={lead._id}>
                    <td><Link to={`/leads/${lead._id}`} className="recent-table__name">{lead.name}</Link></td>
                    <td className="recent-table__email">{lead.email}</td>
                    <td><span className="recent-table__source">{lead.source.replace(/_/g, ' ')}</span></td>
                    <td><StatusBadge status={lead.status}/></td>
                    <td className="recent-table__date">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="recent-empty">
            <MdPeople size={40}/>
            <p>No leads yet. <Link to="/leads/add">Add your first lead →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;