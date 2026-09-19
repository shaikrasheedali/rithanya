import React, { useState, useEffect } from 'react';
import { Droplet, Plus, ArrowUpRight, ArrowDownLeft, AlertTriangle, ShieldCheck } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function InventoryPage() {
  const { addToast } = useToast();
  const [stocks, setStocks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [totals, setTotals] = useState({ totalUnits: 0, availableUnits: 0, criticalAlerts: 0 });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isDispenseOpen, setIsDispenseOpen] = useState(false);

  // Forms
  const [loadForm, setLoadForm] = useState({ group: 'B+', units: 4, source: 'District Blood Center Khammam' });
  const [dispenseForm, setDispenseForm] = useState({ group: 'B+', units: 1, patientId: '', notes: 'Thalassemia Daycare Transfusion' });
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const [invRes, patientsRes] = await Promise.all([
        apiRequest('/inventory'),
        apiRequest('/patients')
      ]);
      setStocks(invRes.data?.stocks || []);
      setLogs(invRes.data?.logs || []);
      setTotals(invRes.data?.totals || { totalUnits: 0, availableUnits: 0, criticalAlerts: 0 });
      setPatients(patientsRes.data || []);
      if (patientsRes.data?.length > 0 && !dispenseForm.patientId) {
        setDispenseForm((prev) => ({ ...prev, patientId: patientsRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleQuickLoad = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/inventory/load', {
        method: 'POST',
        body: JSON.stringify(loadForm)
      });
      addToast(`Added ${loadForm.units} units of ${loadForm.group} to Blood Bank!`, 'success');
      setIsLoadOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to load stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/inventory/dispense', {
        method: 'POST',
        body: JSON.stringify(dispenseForm)
      });
      addToast(`Dispensed ${dispenseForm.units} unit(s) of ${dispenseForm.group} for patient!`, 'success');
      setIsDispenseOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to dispense blood', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Blood Bank Reserve & Transfusion Stock"
        subtitle="Live Blood Inventory, Expiry Tracking & Leukodepletion Issuance"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsLoadOpen(true)}
            >
              <ArrowUpRight size={14} style={{ color: 'var(--green)' }} />
              <span>Stock Load</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsDispenseOpen(true)}
            >
              <ArrowDownLeft size={14} />
              <span>Dispense Blood</span>
            </button>
          </div>
        }
      />

      <div className="admin-content">
        {/* KPI Row */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Total Blood Units</p>
              <h3>{totals.totalUnits}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Across all 8 blood groups</span>
            </div>
            <div className="kpi-icon-wrap">
              <Droplet size={24} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Available for Transfusion</p>
              <h3>{totals.availableUnits}</h3>
              <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                ✓ Unreserved and cross-matched
              </span>
            </div>
            <div className="kpi-icon-wrap green">
              <ShieldCheck size={24} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Threshold Alerts</p>
              <h3 style={{ color: totals.criticalAlerts > 0 ? 'var(--red-700)' : 'inherit' }}>
                {totals.criticalAlerts}
              </h3>
              <span style={{ fontSize: 12, color: totals.criticalAlerts > 0 ? 'var(--red-700)' : 'var(--green)' }}>
                {totals.criticalAlerts > 0 ? 'Urgent replenish required' : 'All stocks healthy'}
              </span>
            </div>
            <div className="kpi-icon-wrap amber">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* BLOOD STOCKS CARDS */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {stocks.map((stock) => {
            const isLow = stock.units <= stock.threshold;
            return (
              <div
                key={stock.id}
                className="card"
                style={{
                  padding: 20,
                  border: isLow ? '1.5px solid var(--red-500)' : '1px solid var(--line)',
                  background: isLow ? '#fffbfa' : '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h2 style={{ fontSize: 28, color: 'var(--red-700)' }}>{stock.group}</h2>
                  <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`}>
                    {isLow ? 'Near Low' : 'Optimal'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Units Available:</span>
                  <strong>{stock.units} units</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Threshold:</span>
                  <span>{stock.threshold} units</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-soft)', borderTop: '1px solid var(--line)', paddingTop: 8 }}>
                  <span>Batch Expiry:</span>
                  <span>{formatDate(stock.expiryDate)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* INVENTORY AUDIT LOGS */}
        <div className="table-container">
          <div className="table-toolbar">
            <h3 style={{ fontSize: 16 }}>Blood Bank Dispense & Restock Audit History</h3>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Log Code</th>
                <th>Group</th>
                <th>Transaction Type</th>
                <th>Units</th>
                <th>Date & Time</th>
                <th>Staff / Performed By</th>
                <th>Patient / Source Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30 }}>No transaction logs yet.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td><strong style={{ color: 'var(--red-700)' }}>{log.logCode}</strong></td>
                    <td><strong style={{ fontSize: 15 }}>{log.bloodGroup}</strong></td>
                    <td>
                      <span className={`badge ${log.type === 'Issued' ? 'badge-red' : 'badge-green'}`}>
                        {log.type}
                      </span>
                    </td>
                    <td><strong>{log.units}</strong> unit(s)</td>
                    <td>{formatDate(log.date)}</td>
                    <td>{log.performedBy}</td>
                    <td style={{ fontSize: 13, color: 'var(--ink)' }}>{log.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* QUICK LOAD MODAL */}
        <Modal
          isOpen={isLoadOpen}
          onClose={() => setIsLoadOpen(false)}
          title="Quick Load Blood Stock"
        >
          <form onSubmit={handleQuickLoad}>
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select
                className="form-control"
                value={loadForm.group}
                onChange={(e) => setLoadForm({ ...loadForm, group: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Units Received *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={loadForm.units}
                onChange={(e) => setLoadForm({ ...loadForm, units: parseInt(e.target.value, 10) || 1 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Source / Blood Camp / Reserve Details</label>
              <input
                type="text"
                className="form-control"
                value={loadForm.source}
                onChange={(e) => setLoadForm({ ...loadForm, source: e.target.value })}
                placeholder="e.g. Red Cross Khammam Blood Camp"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsLoadOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Confirm Stock Load'}
              </button>
            </div>
          </form>
        </Modal>

        {/* DISPENSE BLOOD MODAL */}
        <Modal
          isOpen={isDispenseOpen}
          onClose={() => setIsDispenseOpen(false)}
          title="Dispense Blood for Daycare Transfusion"
        >
          <form onSubmit={handleDispense}>
            <div className="form-group">
              <label className="form-label">Select Registered Patient *</label>
              <select
                className="form-control"
                value={dispenseForm.patientId}
                onChange={(e) => setDispenseForm({ ...dispenseForm, patientId: e.target.value })}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode} · Group: {p.bloodGroup})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Blood Group to Issue *</label>
                <select
                  className="form-control"
                  value={dispenseForm.group}
                  onChange={(e) => setDispenseForm({ ...dispenseForm, group: e.target.value })}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Units to Dispense *</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  className="form-control"
                  value={dispenseForm.units}
                  onChange={(e) => setDispenseForm({ ...dispenseForm, units: parseInt(e.target.value, 10) || 1 })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Transfusion Notes & Cross-Match Status</label>
              <input
                type="text"
                className="form-control"
                value={dispenseForm.notes}
                onChange={(e) => setDispenseForm({ ...dispenseForm, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsDispenseOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Dispensing...' : 'Confirm Issuance'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
