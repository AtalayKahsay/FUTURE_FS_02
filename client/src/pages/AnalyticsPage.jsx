import { useState, useEffect } from 'react';
import { MdTrendingUp, MdPeople, MdAttachMoney, MdCheckCircle } from 'react-icons/md';
import api from '../services/api';
import './AnalyticsPage.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AnalyticsPage = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="analytics-loading">
      {[...Array(3)].map((_, i) => <div key={i} className="analytics-skel" />)}
    </div>
  );

  const maxM = stats?.monthlyLeads?.length
    ? Math.max(...stats.monthlyLeads.map(m => m.count), 1) : 1;

  const kpis = [
    { label:'Total Leads',      value: stats?.total,           icon: MdPeople,       color:'primary' },
    { label:'Conversion Rate',  value: `${stats?.conversionRate}%`, icon: MdTrendingUp, color:'new' },
    { label:'Converted',        value: stats?.converted,       icon: MdCheckCircle,  color:'converted' },
    { label:'Lost Leads',       value: stats?.lost,            icon: MdPeople,       color:'lost' },
  ];

  return (
    <div className="analytics-page">
      {/* KPIs */}
      <div className="analytics-kpis">
        {kpis.map(k => (
          <div key={k.label} className={`analytics-kpi analytics-kpi--${k.color}`}>
            <div className="analytics-kpi-icon"><k.icon size={20} /></div>
            <div>
              <p className="analytics-kpi-label">{k.label}</p>
              <p className="analytics-kpi-value">{k.value ?? '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="analytics-charts">
        {/* Monthly Trend */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Monthly Lead Trend</h3>
          <p className="analytics-card-sub">Leads added per month</p>
          <div className="analytics-bar-chart">
            {stats?.monthlyLeads?.length > 0 ? stats.monthlyLeads.map(m => (
              <div key={`${m._id.year}-${m._id.month}`} className="analytics-bar-col">
                <div className="analytics-bar-wrap">
                  <div className="analytics-bar" style={{ height:`${(m.count/maxM)*100}%` }}>
                    <span className="analytics-bar-val">{m.count}</span>
                  </div>
                </div>
                <span className="analytics-bar-label">{MONTHS[m._id.month-1]}</span>
              </div>
            )) : <p className="analytics-empty">No data yet</p>}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">Pipeline Status</h3>
          <p className="analytics-card-sub">Current lead distribution</p>
          <div className="analytics-pipeline">
            {[
              { label:'New',       value: stats?.new,       color:'var(--color-new)',       bg:'var(--color-new-bg)' },
              { label:'Contacted', value: stats?.contacted, color:'var(--color-contacted)', bg:'var(--color-contacted-bg)' },
              { label:'Converted', value: stats?.converted, color:'var(--color-converted)', bg:'var(--color-converted-bg)' },
              { label:'Lost',      value: stats?.lost,      color:'var(--color-lost)',      bg:'var(--color-lost-bg)' },
            ].map(item => (
              <div key={item.label} className="analytics-pipeline-item">
                <div className="analytics-pipeline-header">
                  <span style={{ color: item.color, fontWeight:600, fontSize:13 }}>{item.label}</span>
                  <span style={{ fontWeight:700, color:'var(--color-text-primary)' }}>{item.value ?? 0}</span>
                </div>
                <div className="analytics-pipeline-track">
                  <div
                    className="analytics-pipeline-fill"
                    style={{
                      width: stats?.total ? `${((item.value||0)/stats.total)*100}%` : '0%',
                      background: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="analytics-card">
        <h3 className="analytics-card-title">Lead Sources</h3>
        <p className="analytics-card-sub">Where your leads are coming from</p>
        <div className="analytics-sources">
          {stats?.sourceStats?.length > 0 ? stats.sourceStats.map(s => {
            const pct = stats.total ? Math.round((s.count/stats.total)*100) : 0;
            return (
              <div key={s._id} className="analytics-source-row">
                <span className="analytics-source-name">{s._id.replace(/_/g,' ')}</span>
                <div className="analytics-source-track">
                  <div className="analytics-source-fill" style={{ width:`${pct}%` }} />
                </div>
                <span className="analytics-source-pct">{s.count} ({pct}%)</span>
              </div>
            );
          }) : <p className="analytics-empty">No source data yet</p>}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;