import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Building2,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Award,
  AlertCircle,
  Calendar,
  Layers,
  Users,
  CreditCard,
  PenTool,
  Check,
  X
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate, numberToWords } from '../../utils/formatters';
import { useHospitalSettings } from '../../context/HospitalSettingsContext';
import Modal from '../../components/common/Modal';

export default function StaffPage() {
  const { addToast } = useToast();
  const { hospitalProfile, formattedPhone } = useHospitalSettings();

  const [activeTab, setActiveTab] = useState('payroll'); // 'payroll' or 'directory'
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);

  // Payroll cycle state
  const [currentMonth, setCurrentMonth] = useState(() => new Date().toISOString().slice(0, 7)); // 'YYYY-MM'
  const [payrollData, setPayrollData] = useState({
    calendarDays: 30,
    payrollRecords: [],
    expenseLines: [],
    totals: {
      totalStaffCount: 0,
      totalStaffSalary: 0,
      totalFacilityOverhead: 0,
      masterDisbursement: 0,
      approvedCount: 0,
      acknowledgedCount: 0,
      isFullyDisbursed: false
    }
  });

  // Modals state
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editStaffItem, setEditStaffItem] = useState(null);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    designation: '',
    department: 'Daycare Transfusion',
    salary: '',
    shift: 'Day',
    phone: '',
    email: '',
    status: 'active'
  });

  // Payroll edit modal
  const [isEditPayrollOpen, setIsEditPayrollOpen] = useState(false);
  const [editPayrollRecord, setEditPayrollRecord] = useState(null);
  const [payrollFormData, setPayrollFormData] = useState({
    lopDays: 0,
    actualWorkingDays: 26,
    allowances: 0,
    otherDeductions: 0,
    paymentMode: 'Bank Transfer',
    paymentReference: '',
    notes: ''
  });

  // Expense line modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseFormData, setExpenseFormData] = useState({
    expenseName: 'Hospital Facility Building Rent',
    category: 'Facility Rent',
    vendorOrPayee: 'Shree Krishna Properties (Landlord)',
    amount: 85000,
    paymentMethod: 'Bank NEFT',
    invoiceRef: '',
    notes: 'Monthly commercial hospital premises rental fee'
  });

  // Pay Slip modal
  const [isPaySlipOpen, setIsPaySlipOpen] = useState(false);
  const [selectedSlipRecord, setSelectedSlipRecord] = useState(null);

  // Digital Signature modal
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signTarget, setSignTarget] = useState({ record: null, roleType: 'DIRECTOR' });
  const [signApproverName, setSignApproverName] = useState('Dr. Narayana Murthy, MD');

  const [submitting, setSubmitting] = useState(false);

  // Print Ref for Pay Slip
  const paySlipPrintRef = useRef(null);

  // Fetch Staff Directory
  const fetchStaff = async () => {
    try {
      const res = await apiRequest('/staff');
      setStaffList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Monthly Payroll Engine Data
  const fetchPayroll = async (monthToFetch = currentMonth) => {
    setLoading(true);
    try {
      const res = await apiRequest(`/staff/payroll?month=${monthToFetch}`);
      if (res.data) {
        setPayrollData(res.data);
      }
    } catch (err) {
      console.error('Error fetching payroll:', err);
      addToast(err.message || 'Failed to load payroll data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchPayroll(currentMonth);
  }, [currentMonth]);

  // Handle month selection change
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setCurrentMonth(newMonth);
  };

  // Open Staff Modal
  const openStaffModal = (item = null) => {
    if (item) {
      setEditStaffItem(item);
      setStaffFormData({
        name: item.name,
        designation: item.designation,
        department: item.department,
        salary: item.salary,
        shift: item.shift,
        phone: item.phone,
        email: item.email,
        status: item.status
      });
    } else {
      setEditStaffItem(null);
      setStaffFormData({
        name: '',
        designation: '',
        department: 'Daycare Transfusion',
        salary: '',
        shift: 'Day',
        phone: '',
        email: '',
        status: 'active'
      });
    }
    setIsStaffModalOpen(true);
  };

  // Save Staff Profile
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editStaffItem) {
        await apiRequest(`/staff/${editStaffItem.id}`, { method: 'PUT', body: JSON.stringify(staffFormData) });
        addToast('Staff profile updated', 'success');
      } else {
        await apiRequest('/staff', { method: 'POST', body: JSON.stringify(staffFormData) });
        addToast('New staff member added', 'success');
      }
      setIsStaffModalOpen(false);
      fetchStaff();
      fetchPayroll(currentMonth);
    } catch (err) {
      addToast(err.message || 'Failed to save staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Staff Profile
  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Delete this staff record?')) return;
    try {
      await apiRequest(`/staff/${id}`, { method: 'DELETE' });
      addToast('Staff member removed', 'success');
      fetchStaff();
      fetchPayroll(currentMonth);
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  // Open Edit Payroll Pro-Rata Line
  const openEditPayroll = (record) => {
    setEditPayrollRecord(record);
    setPayrollFormData({
      lopDays: record.lopDays,
      actualWorkingDays: record.actualWorkingDays,
      allowances: record.allowances,
      otherDeductions: record.otherDeductions,
      paymentMode: record.paymentMode || 'Bank Transfer',
      paymentReference: record.paymentReference || '',
      notes: record.notes || ''
    });
    setIsEditPayrollOpen(true);
  };

  // Save Payroll Pro-Rata Updates
  const handleSavePayroll = async (e) => {
    e.preventDefault();
    if (!editPayrollRecord) return;
    setSubmitting(true);
    try {
      await apiRequest(`/staff/payroll/${editPayrollRecord.id}`, {
        method: 'PUT',
        body: JSON.stringify(payrollFormData)
      });
      addToast(`Updated payroll calculation for ${editPayrollRecord.staffName}`, 'success');
      setIsEditPayrollOpen(false);
      fetchPayroll(currentMonth);
    } catch (err) {
      addToast(err.message || 'Failed to update payroll', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Digital Signature Workflow
  const openSignModal = (record, roleType) => {
    setSignTarget({ record, roleType });
    if (roleType === 'DIRECTOR') {
      setSignApproverName('Dr. Narayana Murthy, MD');
    } else if (roleType === 'SUPERVISOR') {
      setSignApproverName('Dr. C. Shanthi, Pathologist');
    } else {
      setSignApproverName(record.staffName);
    }
    setIsSignModalOpen(true);
  };

  // Submit Digital Signature
  const handleSignSubmit = async (e) => {
    e.preventDefault();
    const { record, roleType } = signTarget;
    if (!record) return;
    setSubmitting(true);
    try {
      const signatureSeal = `SEAL-${roleType}-${Date.now().toString().slice(-6)}`;
      await apiRequest(`/staff/payroll/${record.id}/sign`, {
        method: 'POST',
        body: JSON.stringify({
          roleType,
          signatureData: signatureSeal,
          approverName: signApproverName
        })
      });
      addToast(`Recorded ${roleType} approval for ${record.staffName}`, 'success');
      setIsSignModalOpen(false);
      fetchPayroll(currentMonth);

      // If active pay slip is open, update its record
      if (selectedSlipRecord && selectedSlipRecord.id === record.id) {
        setSelectedSlipRecord((prev) => ({
          ...prev,
          ...(roleType === 'STAFF' && { staffAcknowledged: true, staffSignedAt: new Date() }),
          ...(roleType === 'SUPERVISOR' && { supervisorApproved: true, supervisorName: signApproverName, supervisorSignedAt: new Date() }),
          ...(roleType === 'DIRECTOR' && { directorApproved: true, directorName: signApproverName, directorSignedAt: new Date(), status: 'DISBURSED' })
        }));
      }
    } catch (err) {
      addToast(err.message || 'Signature authorization failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Batch Approve All as Director
  const handleBatchApprove = async () => {
    if (!window.confirm(`Authorize executive digital approval & disbursement for all staff in ${currentMonth}?`)) return;
    setSubmitting(true);
    try {
      await apiRequest('/staff/payroll/batch-approve', {
        method: 'POST',
        body: JSON.stringify({
          month: currentMonth,
          approverName: 'Dr. Narayana Murthy, MD'
        })
      });
      addToast(`All payroll records for ${currentMonth} signed and disbursed!`, 'success');
      fetchPayroll(currentMonth);
    } catch (err) {
      addToast(err.message || 'Failed batch approval', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Save Facility Overhead Expense Line
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/staff/payroll/expenses', {
        method: 'POST',
        body: JSON.stringify({
          ...expenseFormData,
          payrollMonth: currentMonth
        })
      });
      addToast(`Added ${expenseFormData.expenseName} (₹${expenseFormData.amount}) to monthly overhead statement`, 'success');
      setIsExpenseModalOpen(false);
      fetchPayroll(currentMonth);
    } catch (err) {
      addToast(err.message || 'Failed to add expense', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Overhead Expense Line
  const handleDeleteExpense = async (id, name) => {
    if (!window.confirm(`Remove overhead line item "${name}"?`)) return;
    try {
      await apiRequest(`/staff/payroll/expenses/${id}`, { method: 'DELETE' });
      addToast('Expense line item removed', 'success');
      fetchPayroll(currentMonth);
    } catch (err) {
      addToast(err.message || 'Failed to remove expense', 'error');
    }
  };

  // Print Pay Slip to PDF
  const handlePrintPaySlip = () => {
    window.print();
  };

  // Helper for human month name
  const formattedMonthName = (() => {
    try {
      const [y, m] = currentMonth.split('-');
      const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch {
      return currentMonth;
    }
  })();

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Human Resources (HR) & Comprehensive Payroll Engine"
        subtitle="Pro-Rata Attendance Engine, Multi-Signatory Clearances & Facility Rent Statements"
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {activeTab === 'payroll' ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsExpenseModalOpen(true)}
                >
                  <Building2 size={14} style={{ color: '#0369a1' }} />
                  <span>+ Facility Overhead Line</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#15803d', borderColor: '#15803d' }}
                  onClick={handleBatchApprove}
                  disabled={submitting || payrollData.totals.isFullyDisbursed}
                >
                  <Award size={14} />
                  <span>
                    {payrollData.totals.isFullyDisbursed
                      ? '✓ Fully Disbursed'
                      : 'Batch Approve Month (Director)'}
                  </span>
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => openStaffModal()}>
                <Plus size={16} />
                <span>Add Staff Member</span>
              </button>
            )}
          </div>
        }
      />

      <div className="admin-content">
        {/* TOP LEVEL NAVIGATION TABS */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            borderBottom: '2px solid var(--line)',
            marginBottom: 20,
            paddingBottom: 2
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'payroll' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('payroll')}
            style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <DollarSign size={14} />
            <span>Monthly Payroll & Overhead Ledger (Req 8)</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('directory')}
            style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Users size={14} />
            <span>Staff HR Directory ({staffList.length})</span>
          </button>
        </div>

        {/* TAB 1: PAYROLL & OVERHEAD ENGINE (REQ 8) */}
        {activeTab === 'payroll' && (
          <div>
            {/* PAYROLL MONTH CONTROLLER BAR */}
            <div
              className="card"
              style={{
                padding: '14px 20px',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                background: '#ffffff',
                border: '1.5px solid var(--line)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={20} style={{ color: 'var(--red-700)' }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                    Payroll Cycle: {formattedMonthName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    Calendar Days in Month: <strong>{payrollData.calendarDays} Days</strong> · Pro-Rata Standard
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Select Pay Period:</label>
                <input
                  type="month"
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
                  value={currentMonth}
                  onChange={handleMonthChange}
                />
              </div>
            </div>

            {/* FINANCIAL AGGREGATION KPI ROW */}
            <div
              className="kpi-grid"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 24 }}
            >
              <div className="kpi-card">
                <div className="kpi-card-info">
                  <p>Net Staff Payroll Payout</p>
                  <h3 style={{ color: 'var(--navy)' }}>
                    {formatCurrency(payrollData.totals.totalStaffSalary)}
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    {payrollData.totals.totalStaffCount} Active Hospital Employees
                  </span>
                </div>
                <div className="kpi-icon-wrap" style={{ background: '#f0fdf4' }}>
                  <Users size={22} style={{ color: '#16a34a' }} />
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-info">
                  <p>Facility Overheads & Rent</p>
                  <h3 style={{ color: '#0369a1' }}>
                    {formatCurrency(payrollData.totals.totalFacilityOverhead)}
                  </h3>
                  <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 600 }}>
                    Includes Building Rent & AMC
                  </span>
                </div>
                <div className="kpi-icon-wrap" style={{ background: '#f0f9ff' }}>
                  <Building2 size={22} style={{ color: '#0284c7' }} />
                </div>
              </div>

              <div className="kpi-card" style={{ border: '2px solid #bbf7d0', background: '#f0fdf4' }}>
                <div className="kpi-card-info">
                  <p style={{ color: '#166534', fontWeight: 700 }}>Total Hospital Disbursement</p>
                  <h3 style={{ color: '#15803d', fontSize: 26, fontWeight: 800 }}>
                    {formatCurrency(payrollData.totals.masterDisbursement)}
                  </h3>
                  <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
                    Salaries + Facility Overhead
                  </span>
                </div>
                <div className="kpi-icon-wrap green">
                  <DollarSign size={24} style={{ color: '#15803d' }} />
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-info">
                  <p>Approval & Disbursed Status</p>
                  <h3 style={{ color: payrollData.totals.isFullyDisbursed ? '#15803d' : '#b45309' }}>
                    {payrollData.totals.approvedCount} / {payrollData.totals.totalStaffCount}
                  </h3>
                  <span style={{ fontSize: 12, color: payrollData.totals.isFullyDisbursed ? '#15803d' : '#b45309' }}>
                    {payrollData.totals.isFullyDisbursed
                      ? '✓ Fully signed & authorized'
                      : 'Pending final executive seal'}
                  </span>
                </div>
                <div className="kpi-icon-wrap amber">
                  <ShieldCheck size={22} style={{ color: '#b45309' }} />
                </div>
              </div>
            </div>

            {/* MASTER STAFF PRO-RATA PAYROLL REGISTER TABLE */}
            <div className="table-container" style={{ marginBottom: 28 }}>
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                    Master Pro-Rata Staff Payroll Register ({formattedMonthName})
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                    Pro-rata formula: <code>Net = (Fixed / CalendarDays * PaidDays) + Allowances - Deductions</code>
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  <span>Print Ledger</span>
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Base Salary</th>
                    <th>Cal. Days</th>
                    <th>LOP Days</th>
                    <th>Paid Days</th>
                    <th>LOP Deduct.</th>
                    <th>Allowances</th>
                    <th>Other Ded.</th>
                    <th>Net Payable</th>
                    <th>Sign-Off & Approvals</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.payrollRecords.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: 30 }}>
                        No payroll records initialized for {formattedMonthName}.
                      </td>
                    </tr>
                  ) : (
                    payrollData.payrollRecords.map((r) => {
                      const isDisbursed = r.status === 'DISBURSED' || r.directorApproved;

                      return (
                        <tr key={r.id}>
                          <td>
                            <strong style={{ color: 'var(--navy)' }}>{r.staffName}</strong>
                            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                              {r.staffCode} · {r.designation}
                            </div>
                          </td>
                          <td>
                            <strong>{formatCurrency(r.fixedMonthlySalary)}</strong>
                            <div style={{ fontSize: 10, color: 'var(--ink-soft)' }}>
                              ₹{r.perDayRate?.toFixed(1)}/day
                            </div>
                          </td>
                          <td>{r.totalCalendarDays}</td>
                          <td>
                            <span style={{ color: r.lopDays > 0 ? '#dc2626' : 'inherit', fontWeight: r.lopDays > 0 ? 700 : 400 }}>
                              {r.lopDays}
                            </span>
                          </td>
                          <td>
                            <strong>{r.paidDays}</strong>
                          </td>
                          <td>
                            <span style={{ color: r.lopDeduction > 0 ? '#dc2626' : 'var(--ink-soft)' }}>
                              {r.lopDeduction > 0 ? `-₹${r.lopDeduction.toFixed(0)}` : '₹0'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: r.allowances > 0 ? '#15803d' : 'var(--ink-soft)' }}>
                              {r.allowances > 0 ? `+₹${r.allowances}` : '₹0'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: r.otherDeductions > 0 ? '#dc2626' : 'var(--ink-soft)' }}>
                              {r.otherDeductions > 0 ? `-₹${r.otherDeductions}` : '₹0'}
                            </span>
                          </td>
                          <td>
                            <strong style={{ fontSize: 15, color: '#15803d' }}>
                              {formatCurrency(r.netPayableSalary)}
                            </strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 }}>
                              {/* 1. Staff Sign */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                                {r.staffAcknowledged ? (
                                  <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Check size={12} /> Staff Signed
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    style={{
                                      border: 'none',
                                      background: 'none',
                                      color: '#0284c7',
                                      cursor: 'pointer',
                                      padding: 0,
                                      fontSize: 11,
                                      textDecoration: 'underline'
                                    }}
                                    onClick={() => openSignModal(r, 'STAFF')}
                                  >
                                    Sign as Staff
                                  </button>
                                )}
                              </div>

                              {/* 2. Supervisor Sign */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                                {r.supervisorApproved ? (
                                  <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Check size={12} /> Supervisor Verified
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    style={{
                                      border: 'none',
                                      background: 'none',
                                      color: '#7c3aed',
                                      cursor: 'pointer',
                                      padding: 0,
                                      fontSize: 11,
                                      textDecoration: 'underline'
                                    }}
                                    onClick={() => openSignModal(r, 'SUPERVISOR')}
                                  >
                                    Verify (Supervisor)
                                  </button>
                                )}
                              </div>

                              {/* 3. Director Sign */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                                {r.directorApproved ? (
                                  <span className="badge badge-green" style={{ fontSize: 10, padding: '2px 6px' }}>
                                    ✓ Disbursed & Sealed
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    style={{
                                      border: 'none',
                                      background: 'none',
                                      color: '#b45309',
                                      cursor: 'pointer',
                                      padding: 0,
                                      fontSize: 11,
                                      fontWeight: 600,
                                      textDecoration: 'underline'
                                    }}
                                    onClick={() => openSignModal(r, 'DIRECTOR')}
                                  >
                                    Director Seal
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: 11, color: 'var(--navy)' }}
                                onClick={() => {
                                  setSelectedSlipRecord(r);
                                  setIsPaySlipOpen(true);
                                }}
                                title="View official branded salary slip"
                              >
                                <FileText size={12} />
                                <span>Pay Slip</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 6px' }}
                                onClick={() => openEditPayroll(r)}
                                title="Adjust LOP days, working days, or allowances"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* OPERATIONAL & FACILITY OVERHEAD LINE ITEMS (FACILITY RENT) */}
            <div className="table-container">
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                    Monthly Facility Overhead & Operational Expenses ({formattedMonthName})
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                    Recurring premises rent, biomedical waste disposal, equipment AMC, and hospital operational disbursements
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsExpenseModalOpen(true)}
                >
                  <Plus size={14} />
                  <span>Add Expense Item</span>
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Expense Name</th>
                    <th>Category</th>
                    <th>Vendor / Payee</th>
                    <th>Amount (INR)</th>
                    <th>Payment Method</th>
                    <th>Approved By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.expenseLines.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: 25, color: 'var(--ink-soft)' }}>
                        No facility overhead expenses added for {formattedMonthName}.
                      </td>
                    </tr>
                  ) : (
                    payrollData.expenseLines.map((exp) => (
                      <tr key={exp.id}>
                        <td>
                          <strong>{exp.expenseName}</strong>
                          {exp.invoiceRef && (
                            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Ref: {exp.invoiceRef}</div>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-blue">{exp.category}</span>
                        </td>
                        <td>{exp.vendorOrPayee}</td>
                        <td>
                          <strong style={{ fontSize: 15, color: '#0369a1' }}>
                            {formatCurrency(exp.amount)}
                          </strong>
                        </td>
                        <td style={{ fontSize: 12 }}>{exp.paymentMethod}</td>
                        <td style={{ fontSize: 12 }}>{exp.approvedBy}</td>
                        <td>
                          <span className="badge badge-green">{exp.paymentStatus}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626', padding: '3px 6px' }}
                            onClick={() => handleDeleteExpense(exp.id, exp.expenseName)}
                            title="Remove overhead line"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF HR DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Full Name</th>
                  <th>Designation & Department</th>
                  <th>Shift</th>
                  <th>Contact</th>
                  <th>Monthly Fixed Base</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>
                      No staff records found.
                    </td>
                  </tr>
                ) : (
                  staffList.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong style={{ color: 'var(--red-700)' }}>{s.staffCode}</strong>
                      </td>
                      <td>
                        <strong>{s.name}</strong>
                      </td>
                      <td>
                        {s.designation}
                        <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{s.department}</small>
                      </td>
                      <td>
                        <span className="badge badge-blue">{s.shift} Shift</span>
                      </td>
                      <td>
                        <div>
                          <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {s.phone}
                        </div>
                        <small style={{ color: 'var(--ink-soft)' }}>
                          <Mail size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {s.email}
                        </small>
                      </td>
                      <td>
                        <strong>{formatCurrency(s.salary)}</strong>
                      </td>
                      <td>
                        <span className={`status-pill ${s.status}`}>{s.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openStaffModal(s)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#d32f2f' }}
                            onClick={() => handleDeleteStaff(s.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL 1: BRANDED OFFICIAL PAY SLIP (PRINTABLE & PDF) */}
        <Modal
          isOpen={isPaySlipOpen}
          onClose={() => setIsPaySlipOpen(false)}
          title={`Official Salary Slip: ${selectedSlipRecord?.staffName || ''}`}
          size="lg"
        >
          {selectedSlipRecord && (
            <div>
              {/* PRINTABLE LETTERHEAD AREA */}
              <div
                ref={paySlipPrintRef}
                style={{
                  background: '#ffffff',
                  padding: '24px 28px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {/* Hospital Letterhead Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid #991b1b',
                    paddingBottom: 14,
                    marginBottom: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: '#991b1b',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 22
                      }}
                    >
                      R
                    </div>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#991b1b', letterSpacing: '-0.3px', margin: 0 }}>
                        RITHANYA HOSPITAL
                      </h2>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginTop: 1 }}>
                        Day Care Hematology, Clinical Diabetology & Blood Bank Center
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        Reg No: RH-TS-MED-2024-8891 · Wyra Road, Khammam - 507001, Telangana
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Emergency & Transfusion Hotline:</div>
                    <strong style={{ fontSize: 13, color: '#991b1b' }}>{formattedPhone}</strong>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      Pay Period: <strong>{formattedMonthName}</strong>
                    </div>
                  </div>
                </div>

                {/* Subheading */}
                <div
                  style={{
                    textAlign: 'center',
                    background: '#f8fafc',
                    padding: '6px 0',
                    borderRadius: 4,
                    marginBottom: 16,
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Salary Disbursement Slip · {formattedMonthName}
                  </h3>
                </div>

                {/* Employee Details Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12,
                    padding: '12px 14px',
                    background: '#fafaf9',
                    borderRadius: 6,
                    border: '1px solid #e7e5e4',
                    fontSize: 12,
                    marginBottom: 16
                  }}
                >
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Staff Code:</span>
                    <strong>{selectedSlipRecord.staffCode}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Employee Name:</span>
                    <strong>{selectedSlipRecord.staffName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Designation:</span>
                    <strong>{selectedSlipRecord.designation}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Department:</span>
                    <strong>{selectedSlipRecord.department}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Calendar Days:</span>
                    <strong>{selectedSlipRecord.totalCalendarDays} Days</strong>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>LOP Days (Unpaid):</span>
                    <strong style={{ color: selectedSlipRecord.lopDays > 0 ? '#dc2626' : 'inherit' }}>
                      {selectedSlipRecord.lopDays} Days
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Paid Working Days:</span>
                    <strong>{selectedSlipRecord.paidDays} Days</strong>
                  </div>
                  <div>
                    <span style={{ color: '#78716c', display: 'block' }}>Payment Method:</span>
                    <strong>{selectedSlipRecord.paymentMode}</strong>
                  </div>
                </div>

                {/* Earnings & Deductions Tables */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  {/* Earnings */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ background: '#f1f5f9', padding: '6px 12px', fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
                      EARNINGS
                    </div>
                    <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px' }}>Basic Monthly Salary</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(selectedSlipRecord.fixedMonthlySalary)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px' }}>Paid Days Salary ({selectedSlipRecord.paidDays} Days)</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(
                              Math.round(selectedSlipRecord.fixedMonthlySalary - selectedSlipRecord.lopDeduction)
                            )}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px' }}>Special & Night Shift Allowances</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(selectedSlipRecord.allowances)}
                          </td>
                        </tr>
                        <tr style={{ background: '#fafafa', fontWeight: 700 }}>
                          <td style={{ padding: '8px 12px' }}>Gross Payable Earnings</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#15803d' }}>
                            {formatCurrency(
                              Math.round(
                                selectedSlipRecord.fixedMonthlySalary -
                                  selectedSlipRecord.lopDeduction +
                                  selectedSlipRecord.allowances
                              )
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Deductions */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ background: '#f1f5f9', padding: '6px 12px', fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
                      DEDUCTIONS
                    </div>
                    <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px' }}>Loss of Pay (LOP) Deduction ({selectedSlipRecord.lopDays}d)</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>
                            {formatCurrency(selectedSlipRecord.lopDeduction)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px' }}>Professional Tax / TDS / Advance</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>
                            {formatCurrency(selectedSlipRecord.otherDeductions)}
                          </td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px', color: '#64748b' }}>Other Institutional Deductions</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>₹0</td>
                        </tr>
                        <tr style={{ background: '#fafafa', fontWeight: 700 }}>
                          <td style={{ padding: '8px 12px' }}>Total Deductions</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#dc2626' }}>
                            {formatCurrency(selectedSlipRecord.lopDeduction + selectedSlipRecord.otherDeductions)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Net Take-Home Salary Banner */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: 6,
                    padding: '12px 18px',
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                      Net Disbursed Take-Home Salary:
                    </span>
                    <div style={{ fontSize: 12, color: '#15803d', fontStyle: 'italic', marginTop: 2 }}>
                      {numberToWords(selectedSlipRecord.netPayableSalary)}
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d' }}>
                    {formatCurrency(selectedSlipRecord.netPayableSalary)}
                  </div>
                </div>

                {/* Tri-Partite Multi-Signatory Clearances */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    borderTop: '1px solid #cbd5e1',
                    paddingTop: 16
                  }}
                >
                  {/* Signatory 1: Employee */}
                  <div
                    style={{
                      border: '1px dashed #cbd5e1',
                      borderRadius: 6,
                      padding: 12,
                      textAlign: 'center',
                      background: selectedSlipRecord.staffAcknowledged ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                      1. Employee Acknowledgment
                    </div>
                    {selectedSlipRecord.staffAcknowledged ? (
                      <div>
                        <div style={{ fontSize: 13, fontFamily: 'cursive', color: '#0369a1', fontWeight: 700 }}>
                          {selectedSlipRecord.staffName}
                        </div>
                        <div style={{ fontSize: 10, color: '#15803d', marginTop: 2 }}>
                          ✓ Digitally Signed on {formatDate(selectedSlipRecord.staffSignedAt || new Date())}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={() => openSignModal(selectedSlipRecord, 'STAFF')}
                      >
                        <PenTool size={11} />
                        <span>Sign as Employee</span>
                      </button>
                    )}
                  </div>

                  {/* Signatory 2: HR / Supervisor */}
                  <div
                    style={{
                      border: '1px dashed #cbd5e1',
                      borderRadius: 6,
                      padding: 12,
                      textAlign: 'center',
                      background: selectedSlipRecord.supervisorApproved ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                      2. HR & Transfusion Supervisor
                    </div>
                    {selectedSlipRecord.supervisorApproved ? (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#4338ca' }}>
                          {selectedSlipRecord.supervisorName || 'Dr. C. Shanthi, Pathologist'}
                        </div>
                        <div style={{ fontSize: 10, color: '#15803d', marginTop: 2 }}>
                          ✓ Verified & Audited on {formatDate(selectedSlipRecord.supervisorSignedAt || new Date())}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={() => openSignModal(selectedSlipRecord, 'SUPERVISOR')}
                      >
                        <Check size={11} />
                        <span>Audit Clearance</span>
                      </button>
                    )}
                  </div>

                  {/* Signatory 3: Managing Director (Dr. Narayana Murthy) */}
                  <div
                    style={{
                      border: '1px dashed #cbd5e1',
                      borderRadius: 6,
                      padding: 12,
                      textAlign: 'center',
                      background: selectedSlipRecord.directorApproved ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                      3. Managing Director Approval
                    </div>
                    {selectedSlipRecord.directorApproved ? (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#991b1b' }}>
                          Dr. Narayana Murthy, MD
                        </div>
                        <div style={{ fontSize: 10, color: '#15803d', marginTop: 2 }}>
                          ✓ Executive Seal & Disbursed ({formatDate(selectedSlipRecord.directorSignedAt || new Date())})
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 11, padding: '3px 8px', background: '#991b1b', borderColor: '#991b1b' }}
                        onClick={() => openSignModal(selectedSlipRecord, 'DIRECTOR')}
                      >
                        <Award size={11} />
                        <span>Director Seal</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Note */}
                <div style={{ textAlign: 'center', marginTop: 18, fontSize: 10, color: '#94a3b8' }}>
                  This is a computer-generated official payroll voucher of Rithanya Hospital. Validated under Hospital Financial Management & DPDP Compliance.
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPaySlipOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePrintPaySlip}
                >
                  <Printer size={14} />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* MODAL 2: EDIT PRO-RATA PAYROLL LINE */}
        <Modal
          isOpen={isEditPayrollOpen}
          onClose={() => setIsEditPayrollOpen(false)}
          title={`Adjust Payroll: ${editPayrollRecord?.staffName || ''}`}
        >
          <form onSubmit={handleSavePayroll}>
            <div style={{ marginBottom: 14, padding: 10, background: '#f8fafc', borderRadius: 6, fontSize: 13 }}>
              Fixed Monthly Salary: <strong>{formatCurrency(editPayrollRecord?.fixedMonthlySalary || 0)}</strong> · Calendar Days: <strong>{payrollData.calendarDays}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Loss of Pay (LOP) Days *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="31"
                  className="form-control"
                  value={payrollFormData.lopDays}
                  onChange={(e) => setPayrollFormData({ ...payrollFormData, lopDays: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Actual Working Days</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  className="form-control"
                  value={payrollFormData.actualWorkingDays}
                  onChange={(e) =>
                    setPayrollFormData({ ...payrollFormData, actualWorkingDays: parseInt(e.target.value, 10) || 0 })
                  }
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Special Allowances (INR)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={payrollFormData.allowances}
                  onChange={(e) => setPayrollFormData({ ...payrollFormData, allowances: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Other Deductions (TDS/Advance)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={payrollFormData.otherDeductions}
                  onChange={(e) =>
                    setPayrollFormData({ ...payrollFormData, otherDeductions: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-control"
                  value={payrollFormData.paymentMode}
                  onChange={(e) => setPayrollFormData({ ...payrollFormData, paymentMode: e.target.value })}
                >
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  <option value="UPI">UPI Disbursement</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash Voucher</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction / UTR Reference</label>
                <input
                  type="text"
                  className="form-control"
                  value={payrollFormData.paymentReference}
                  onChange={(e) => setPayrollFormData({ ...payrollFormData, paymentReference: e.target.value })}
                  placeholder="e.g. UTR-2026-99120"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">HR Remarks / Notes</label>
              <textarea
                className="form-control"
                rows="2"
                value={payrollFormData.notes}
                onChange={(e) => setPayrollFormData({ ...payrollFormData, notes: e.target.value })}
                placeholder="Adjustments or overtime notes..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditPayrollOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <span>{submitting ? 'Recalculating...' : 'Update & Recalculate'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 3: ADD FACILITY OVERHEAD EXPENSE LINE */}
        <Modal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          title={`Add Facility Overhead Expense (${formattedMonthName})`}
        >
          <form onSubmit={handleSaveExpense}>
            <div className="form-group">
              <label className="form-label">Expense Description *</label>
              <input
                type="text"
                className="form-control"
                value={expenseFormData.expenseName}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, expenseName: e.target.value })}
                placeholder="e.g. Hospital Facility Building Rent"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={expenseFormData.category}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
                >
                  <option value="Facility Rent">Facility Rent</option>
                  <option value="Utilities & Power">Utilities & Power</option>
                  <option value="Biomedical Waste Disposal">Biomedical Waste Disposal</option>
                  <option value="Equipment AMC Maintenance">Equipment AMC Maintenance</option>
                  <option value="Clinical Consumables">Clinical Consumables</option>
                  <option value="Other Operational Overhead">Other Operational Overhead</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (INR) *</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={expenseFormData.amount}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Vendor / Payee Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={expenseFormData.vendorOrPayee}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, vendorOrPayee: e.target.value })}
                  placeholder="e.g. Shree Krishna Properties (Landlord)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={expenseFormData.paymentMethod}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, paymentMethod: e.target.value })}
                >
                  <option value="Bank NEFT">Bank NEFT</option>
                  <option value="Cheque">Cheque</option>
                  <option value="RTGS">RTGS</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Invoice / Receipt Reference</label>
              <input
                type="text"
                className="form-control"
                value={expenseFormData.invoiceRef}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, invoiceRef: e.target.value })}
                placeholder="e.g. RENT-INV-2026-SEP"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsExpenseModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <span>{submitting ? 'Adding...' : 'Add Overhead Line'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 4: DIGITAL SIGNATURE WORKFLOW */}
        <Modal
          isOpen={isSignModalOpen}
          onClose={() => setIsSignModalOpen(false)}
          title={`Digital Approval Signature: ${signTarget.roleType}`}
        >
          <form onSubmit={handleSignSubmit}>
            <div style={{ marginBottom: 14, padding: 12, background: '#faf5ff', borderRadius: 6, border: '1px solid #d8b4fe' }}>
              <div style={{ fontSize: 13, color: '#6b21a8', fontWeight: 600 }}>
                {signTarget.roleType === 'DIRECTOR'
                  ? 'Managing Director Executive Seal & Final Payout Authorization'
                  : signTarget.roleType === 'SUPERVISOR'
                  ? 'HR / Clinical Transfusion Supervisor Audit Verification'
                  : 'Employee Monthly Hours & Salary Acknowledgment'}
              </div>
              <div style={{ fontSize: 12, color: '#581c87', marginTop: 4 }}>
                Authorizing line item for: <strong>{signTarget.record?.staffName}</strong> ({signTarget.record?.staffCode}) · Net:{' '}
                <strong>{formatCurrency(signTarget.record?.netPayableSalary || 0)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Authorized Signatory Name *</label>
              <input
                type="text"
                className="form-control"
                value={signApproverName}
                onChange={(e) => setSignApproverName(e.target.value)}
                required
              />
            </div>

            {/* Signature Preview Canvas / Stamp */}
            <div
              style={{
                border: '1.5px dashed #cbd5e1',
                borderRadius: 8,
                padding: '20px 10px',
                textAlign: 'center',
                background: '#ffffff',
                marginBottom: 16
              }}
            >
              <div style={{ fontSize: 22, fontFamily: 'cursive', color: '#0f172a', fontWeight: 700 }}>
                {signApproverName}
              </div>
              <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>
                ✓ Cryptographic Digital Signature & Timestamp
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                RITHANYA HOSPITAL INTERNAL CLINICAL HR SEAL
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsSignModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: '#15803d', borderColor: '#15803d' }}
                disabled={submitting}
              >
                <CheckCircle2 size={14} />
                <span>{submitting ? 'Recording...' : 'Affix Digital Signature'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 5: STAFF PROFILE CREATE/EDIT */}
        <Modal
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
          title={editStaffItem ? 'Edit Staff Profile' : 'Add Staff Member'}
          size="lg"
        >
          <form onSubmit={handleSaveStaff}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Senior Transfusion Nurse"
                  value={staffFormData.designation}
                  onChange={(e) => setStaffFormData({ ...staffFormData, designation: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Daycare Transfusion"
                  value={staffFormData.department}
                  onChange={(e) => setStaffFormData({ ...staffFormData, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Fixed Salary (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 38000"
                  value={staffFormData.salary}
                  onChange={(e) => setStaffFormData({ ...staffFormData, salary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shift</label>
                <select
                  className="form-control"
                  value={staffFormData.shift}
                  onChange={(e) => setStaffFormData({ ...staffFormData, shift: e.target.value })}
                >
                  <option value="Day">Day Shift (9 AM - 5 PM)</option>
                  <option value="Morning">Morning Shift (7 AM - 3 PM)</option>
                  <option value="Night">Night Shift (9 PM - 7 AM)</option>
                  <option value="Rotational">Rotational</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={staffFormData.phone}
                  onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={staffFormData.email}
                onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsStaffModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Staff Profile'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
