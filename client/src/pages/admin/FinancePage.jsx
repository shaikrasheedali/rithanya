import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, Trash2, Tag, Calendar } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function FinancePage() {
  const { addToast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categorySummary, setCategorySummary] = useState({});
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Medical supplies',
    vendor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'paid',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchFinance = async () => {
    try {
      const res = await apiRequest('/finance');
      setExpenses(res.data?.expenses || []);
      setTotalExpense(res.data?.totalExpense || 0);
      setCategorySummary(res.data?.categorySummary || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/finance', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      addToast('Expense recorded successfully', 'success');
      setIsOpen(false);
      setFormData({
        name: '',
        category: 'Medical supplies',
        vendor: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
        notes: ''
      });
      fetchFinance();
    } catch (err) {
      addToast(err.message || 'Failed to save expense', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense entry?')) return;
    try {
      await apiRequest(`/finance/${id}`, { method: 'DELETE' });
      addToast('Expense deleted', 'success');
      fetchFinance();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Hospital Finance, Expenses & Procurement"
        subtitle="Medical Supplies, Bio-reagents, Oxygen, Utilities & Facility Expenditure"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsOpen(true)}>
            <Plus size={16} />
            <span>Record Expense</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="kpi-grid" style={{ marginBottom: 28 }}>
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Total Monthly Outflow</p>
              <h3 style={{ color: 'var(--red-700)' }}>{formatCurrency(totalExpense)}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{expenses.length} vendor items logged</span>
            </div>
            <div className="kpi-icon-wrap">
              <IndianRupee size={24} />
            </div>
          </div>

          {Object.entries(categorySummary).slice(0, 3).map(([cat, amt]) => (
            <div key={cat} className="kpi-card">
              <div className="kpi-card-info">
                <p>{cat}</p>
                <h3>{formatCurrency(amt)}</h3>
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  {Math.round((amt / (totalExpense || 1)) * 100)}% of total
                </span>
              </div>
              <div className="kpi-icon-wrap blue">
                <Tag size={20} />
              </div>
            </div>
          ))}
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: 40 }}>Loading finances...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: 40 }}>No expenses recorded yet.</td></tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td><strong style={{ color: 'var(--red-700)' }}>{exp.expenseCode}</strong></td>
                    <td><strong>{exp.name}</strong></td>
                    <td><span className="badge badge-red">{exp.category}</span></td>
                    <td>{exp.vendor}</td>
                    <td><strong style={{ fontSize: 14 }}>{formatCurrency(exp.amount)}</strong></td>
                    <td>{formatDate(exp.date)}</td>
                    <td><span className={`status-pill ${exp.status}`}>{exp.status}</span></td>
                    <td style={{ maxWidth: 200, fontSize: 12 }}>{exp.notes || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#d32f2f' }}
                        onClick={() => handleDelete(exp.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Record Hospital Expense"
        >
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Expense Description *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Diagnostic Bio-analyzer Reagents"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Medical supplies">Medical supplies</option>
                  <option value="Clinical operations">Clinical operations</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Payroll">Payroll</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="e.g. 19400"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Vendor / Payee *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Apollo Diagnostic Supplies"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Recording...' : 'Save Expense Record'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
