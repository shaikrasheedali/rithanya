import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Droplet,
  CalendarCheck,
  Stethoscope,
  BedDouble,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    inpatientsCount: 0,
    totalPatients: 0,
    bloodTotals: { totalUnits: 0, availableUnits: 0, criticalAlerts: 0 },
    todayAppointments: 0,
    totalExpenses: 0
  });
  const [recentReadings, setRecentReadings] = useState([]);
  const [bloodStocks, setBloodStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [patientsRes, admissionsRes, inventoryRes, appointmentsRes, readingsRes, financeRes] =
          await Promise.all([
            apiRequest('/patients'),
            apiRequest('/admissions?status=admitted'),
            apiRequest('/inventory'),
            apiRequest('/appointments'),
            apiRequest('/clinical?limit=5'),
            apiRequest('/finance')
          ]);

        const patients = patientsRes.data || [];
        const admissions = admissionsRes.data || [];
        const inventoryData = inventoryRes.data || { stocks: [], totals: {} };
        const appointments = appointmentsRes.data || [];
        const readings = readingsRes.data || [];
        const finance = financeRes.data || { totalExpense: 0 };

        setStats({
          inpatientsCount: admissions.length,
          totalPatients: patients.length,
          bloodTotals: inventoryData.totals || { totalUnits: 0, availableUnits: 0, criticalAlerts: 0 },
          todayAppointments: appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed').length,
          totalExpenses: finance.totalExpense || 0
        });

        setRecentReadings(readings);
        setBloodStocks(inventoryData.stocks || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Executive Clinical Dashboard"
        subtitle="Rithanya Hospital · Real-Time Clinical Operations & Daycare Status"
      />

      <div className="admin-content">
        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Active Daycare Inpatients</p>
              <h3>{stats.inpatientsCount}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                {stats.totalPatients} registered EMR patients
              </span>
            </div>
            <div className="kpi-icon-wrap">
              <BedDouble size={24} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Available Blood Units</p>
              <h3>{stats.bloodTotals.availableUnits}</h3>
              <span
                style={{
                  fontSize: 12,
                  color: stats.bloodTotals.criticalAlerts > 0 ? 'var(--red-700)' : 'var(--green)',
                  fontWeight: 600
                }}
              >
                {stats.bloodTotals.criticalAlerts > 0
                  ? `⚠️ ${stats.bloodTotals.criticalAlerts} Group(s) Near Threshold`
                  : '✓ Blood Reserves Normal'}
              </span>
            </div>
            <div className={`kpi-icon-wrap ${stats.bloodTotals.criticalAlerts > 0 ? '' : 'green'}`}>
              <Droplet size={24} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Active Appointments</p>
              <h3>{stats.todayAppointments}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>OPD & Daycare bookings</span>
            </div>
            <div className="kpi-icon-wrap amber">
              <CalendarCheck size={24} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Monthly Expenses</p>
              <h3>{formatCurrency(stats.totalExpenses)}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Supplies, oxygen & lab</span>
            </div>
            <div className="kpi-icon-wrap blue">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="card" style={{ padding: 20, marginBottom: 28, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h4 style={{ fontSize: 15 }}>Quick Clinical Actions</h4>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Direct shortcuts for OPD and transfusion intake</p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="/admin/patients?action=new" className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Register Patient</span>
              </Link>
              <Link to="/admin/clinical?action=new" className="btn btn-secondary btn-sm">
                <Stethoscope size={14} />
                <span>Log Clinical Vitals</span>
              </Link>
              <Link to="/admin/inventory?action=load" className="btn btn-secondary btn-sm">
                <Droplet size={14} />
                <span>Quick Blood Stock Load</span>
              </Link>
              <Link to="/admin/admissions?action=new" className="btn btn-secondary btn-sm">
                <BedDouble size={14} />
                <span>Admit to Daycare</span>
              </Link>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN GRID: RECENT VITALS & BLOOD BANK STATUS */}
        <div className="grid-2" style={{ gap: 24 }}>
          {/* Recent Vitals */}
          <div className="table-container">
            <div className="table-toolbar">
              <h3 style={{ fontSize: 16 }}>Recent Clinical Vitals</h3>
              <Link to="/admin/clinical" className="btn btn-outline btn-sm">
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Blood Sugar</th>
                  <th>HbA1c</th>
                  <th>BP</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReadings.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 30 }}>
                      No clinical logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentReadings.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.patient?.name || 'Patient'}</strong>
                        <small style={{ display: 'block', color: 'var(--ink-soft)' }}>
                          {r.patient?.patientCode}
                        </small>
                      </td>
                      <td>
                        {r.bloodSugarFasting
                          ? `F: ${r.bloodSugarFasting} mg/dL`
                          : r.bloodSugarPP
                          ? `PP: ${r.bloodSugarPP} mg/dL`
                          : '—'}
                      </td>
                      <td>{r.hba1c ? `${r.hba1c}%` : '—'}</td>
                      <td>{r.bpSystolic && r.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic}` : '—'}</td>
                      <td>{formatDate(r.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Blood Bank Live Stock */}
          <div className="table-container">
            <div className="table-toolbar">
              <h3 style={{ fontSize: 16 }}>Blood Bank Units Status</h3>
              <Link to="/admin/inventory" className="btn btn-outline btn-sm">
                <span>Manage Stock</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Available Units</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bloodStocks.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ fontSize: 15, color: 'var(--red-700)' }}>{b.group}</strong>
                    </td>
                    <td>
                      <strong>{b.units}</strong> <small style={{ color: 'var(--ink-soft)' }}>units</small>
                    </td>
                    <td>{b.threshold} units</td>
                    <td>
                      {b.units <= b.threshold ? (
                        <span className="badge badge-red">Critical Low</span>
                      ) : (
                        <span className="badge badge-green">Optimal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
