import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdHandshake } from 'react-icons/md';
import api from '../services/api';
import StatusBadge from '../components/leads/StatusBadge';
import './DealsPage.css';

const STAGES = [
  { key: 'new',       label: 'New Leads',    color: 'var(--color-new)' },
  { key: 'contacted', label: 'Contacted',    color: 'var(--color-contacted)' },
  { key: 'converted', label: 'Converted',    color: 'var(--color-converted)' },
  { key: 'lost',      label: 'Lost',         color: 'var(--color-lost)' },
];

const DealsPage = () => {
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leads?limit=100')
      .then(({ data }) => setLeads(data.leads))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const byStage = key => leads.filter(l => l.status === key);
  const totalValue = key => byStage(key).reduce((s, l) => s + (l.value || 0), 0);

  return (
    <div className="deals-page">
      {loading ? (
        <div className="deals-loading">
          {[...Array(4)].map((_, i) => <div key={i} className="deals-skel" />)}
        </div>
      ) : (
        <div className="deals-board">
          {STAGES.map(stage => (
            <div key={stage.key} className="deals-column">
              <div className="deals-col-header" style={{ borderTopColor: stage.color }}>
                <div>
                  <p className="deals-col-title">{stage.label}</p>
                  <p className="deals-col-meta">{byStage(stage.key).length} deals · ${totalValue(stage.key).toLocaleString()}</p>
                </div>
                <span className="deals-col-count" style={{ background: stage.color + '20', color: stage.color }}>
                  {byStage(stage.key).length}
                </span>
              </div>
              <div className="deals-cards">
                {byStage(stage.key).length === 0 ? (
                  <div className="deals-empty-col">No deals</div>
                ) : (
                  byStage(stage.key).map(lead => (
                    <Link key={lead._id} to={`/leads/${lead._id}`} className="deal-card">
                      <div className="deal-card-top">
                        <div className="deal-avatar">{lead.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="deal-name">{lead.name}</p>
                          {lead.company && <p className="deal-company">{lead.company}</p>}
                        </div>
                      </div>
                      {lead.value > 0 && (
                        <p className="deal-value">${lead.value.toLocaleString()}</p>
                      )}
                      <div className="deal-footer">
                        <StatusBadge status={lead.priority} type="priority" small />
                        <span className="deal-source">{lead.source.replace(/_/g,' ')}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealsPage;