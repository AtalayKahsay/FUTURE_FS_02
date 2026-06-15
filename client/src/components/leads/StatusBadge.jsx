import './StatusBadge.css';

const STATUS_MAP = {
  new:       { label: 'New',       cls: 'badge--new' },
  contacted: { label: 'Contacted', cls: 'badge--contacted' },
  converted: { label: 'Converted', cls: 'badge--converted' },
  lost:      { label: 'Lost',      cls: 'badge--lost' },
};

const PRIORITY_MAP = {
  low:    { label: 'Low',    cls: 'badge--p-low' },
  medium: { label: 'Medium', cls: 'badge--p-medium' },
  high:   { label: 'High',   cls: 'badge--p-high' },
};

const StatusBadge = ({ status, type = 'status', small = false }) => {
  const map = type === 'priority' ? PRIORITY_MAP : STATUS_MAP;
  const cfg = map[status] || { label: status, cls: '' };

  return (
    <span className={`badge ${cfg.cls}${small ? ' badge--small' : ''}`}>
      {cfg.label}
    </span>
  );
};

export default StatusBadge;