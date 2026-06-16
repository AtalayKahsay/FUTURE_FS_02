import { useState, useEffect } from 'react';
import { MdAdd, MdCheckCircle, MdRadioButtonUnchecked, MdDelete, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import './TasksPage.css';

const PRIORITIES = ['low', 'medium', 'high'];

const TasksPage = () => {
  const [tasks, setTasks]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('crm_tasks') || '[]'); } catch { return []; }
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ title:'', description:'', priority:'medium', dueDate:'' });

  const save = updated => {
    setTasks(updated);
    localStorage.setItem('crm_tasks', JSON.stringify(updated));
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required.');
    const task = { id: Date.now().toString(), ...form, done: false, createdAt: new Date().toISOString() };
    save([task, ...tasks]);
    setForm({ title:'', description:'', priority:'medium', dueDate:'' });
    setShowModal(false);
    toast.success('Task added!');
  };

  const toggleDone = id => {
    save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = id => {
    save(tasks.filter(t => t.id !== id));
    toast.success('Task removed.');
  };

  const pending   = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);
  const priorityColor = { low:'#10b981', medium:'#f59e0b', high:'#ef4444' };

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header">
        <div>
          <p className="tasks-stats">{pending.length} pending · {completed.length} completed</p>
        </div>
        <button className="tasks-add-btn" onClick={() => setShowModal(true)}>
          <MdAdd size={18} /> Add Task
        </button>
      </div>

      {/* Pending */}
      <div className="tasks-section">
        <h3 className="tasks-section-title">Pending ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="tasks-empty">
            <MdCheckCircle size={40} />
            <p>All caught up! No pending tasks.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {pending.map(task => (
              <div key={task.id} className="task-card">
                <button className="task-check" onClick={() => toggleDone(task.id)}>
                  <MdRadioButtonUnchecked size={22} color="var(--color-text-muted)" />
                </button>
                <div className="task-body">
                  <p className="task-title">{task.title}</p>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-meta">
                    <span className="task-priority" style={{ color: priorityColor[task.priority] }}>
                      ● {task.priority}
                    </span>
                    {task.dueDate && <span className="task-due">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button className="task-delete" onClick={() => deleteTask(task.id)}>
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="tasks-section">
          <h3 className="tasks-section-title">Completed ({completed.length})</h3>
          <div className="tasks-list">
            {completed.map(task => (
              <div key={task.id} className="task-card task-card--done">
                <button className="task-check" onClick={() => toggleDone(task.id)}>
                  <MdCheckCircle size={22} color="var(--color-converted)" />
                </button>
                <div className="task-body">
                  <p className="task-title task-title--done">{task.title}</p>
                </div>
                <button className="task-delete" onClick={() => deleteTask(task.id)}>
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="tasks-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="tasks-modal" onClick={e => e.stopPropagation()}>
            <div className="tasks-modal-header">
              <h3>Add New Task</h3>
              <button onClick={() => setShowModal(false)}><MdClose size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="tasks-modal-form">
              <div className="tasks-field">
                <label>Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Task title" required />
              </div>
              <div className="tasks-field">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional details" rows={3} />
              </div>
              <div className="tasks-field-row">
                <div className="tasks-field">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="tasks-field">
                  <label>Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>
              <div className="tasks-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;