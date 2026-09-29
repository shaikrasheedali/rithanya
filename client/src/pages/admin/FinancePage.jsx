import React, { useState, useEffect } from 'react';
import {
  Plus,
  IndianRupee,
  Trash2,
  Tag,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
  Users,
  ShoppingBag,
  FileText,
  Upload,
  Eye,
  Download,
  Filter,
  Search,
  ExternalLink,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

// Curated Hospital Vendors
const CURATED_VENDORS = [
  'Siemens Healthineers India',
  'Transasia Bio-Medicals Ltd',
  'Southern Power Distribution (APCPDCL)',
  'Linde Medical Gases / Liquid Oxygen',
  'Shree Krishna Properties (Premises Landlord)',
  'Bio-Clean Biomedical Waste Solutions',
  'Apollo MedTech Supplies',
  'Roche Diagnostics India',
  'Wipro GE Healthcare',
  'B. Braun Medical India',
  'Bharat Sanchar Nigam Ltd (BSNL Telecom)',
  'Municipal Corporation Water Works',
  'Thermo Fisher Scientific',
  'Agappe Diagnostics Ltd',
  'Other / Custom Vendor'
];

// Defined Hospital Categories
const EXPENSE_CATEGORIES = [
  'Facility Rent',
  'Medical Supplies & Reagents',
  'Clinical Operations & Consumables',
  'Utilities & Power',
  'Biomedical Waste Disposal',
  'Equipment AMC & Maintenance',
  'Regulatory & Compliance',
  'Other Operational Overhead'
];

export default function FinancePage() {
  const { addToast } = useToast();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'approvals' | 'facility'
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date().toISOString().slice(0, 7) // 'YYYY-MM'
  );

  // Data State
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categorySummary, setCategorySummary] = useState({});
  const [facilityRentExpenses, setFacilityRentExpenses] = useState([]);
  const [vendorExpenses, setVendorExpenses] = useState([]);
  const [kpis, setKpis] = useState({
    totalOutflow: 0,
    payrollOutflow: 0,
    rentOutflow: 0,
    vendorOutflow: 0,
    pendingOutflow: 0,
    paidOutflow: 0,
    totalStaffCount: 0,
    pendingApprovalCount: 0
  });
  const [approvalQueue, setApprovalQueue] = useState([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Strict Expense Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedVendorOption, setSelectedVendorOption] = useState(CURATED_VENDORS[0]);
  const [customVendorName, setCustomVendorName] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    category: 'Medical Supplies & Reagents',
    vendor: CURATED_VENDORS[0],
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank NEFT',
    invoiceRef: '',
    receiptUrl: '',
    notes: ''
  });

  // Universal Approval Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [activeApprovalItem, setActiveApprovalItem] = useState(null);
  const [approverName, setApproverName] = useState('Dr. C. Shanthi, Pathologist');
  const [approvalRole, setApprovalRole] = useState('SUPERVISOR');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [submittingApproval, setSubmittingApproval] = useState(false);

  // Receipt Preview Modal
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);

  // Fetch Financial Data
  const fetchFinance = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/finance?month=${selectedMonth}`);
      if (res.success && res.data) {
        setExpenses(res.data.expenses || []);
        setTotalExpense(res.data.totalExpense || 0);
        setCategorySummary(res.data.categorySummary || {});
        setFacilityRentExpenses(res.data.facilityRentExpenses || []);
        setVendorExpenses(res.data.vendorExpenses || []);
        setKpis(
          res.data.kpis || {
            totalOutflow: 0,
            payrollOutflow: 0,
            rentOutflow: 0,
            vendorOutflow: 0,
            pendingOutflow: 0,
            paidOutflow: 0,
            totalStaffCount: 0,
            pendingApprovalCount: 0
          }
        );
        setApprovalQueue(res.data.approvalQueue || []);
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to fetch financial records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, [selectedMonth]);

  // Open Record Expense Modal
  const openRecordModal = (defaultCategory = 'Medical Supplies & Reagents') => {
    setFormErrors({});
    setSelectedVendorOption(CURATED_VENDORS[0]);
    setCustomVendorName('');
    setFormData({
      name: '',
      category: defaultCategory,
      vendor: CURATED_VENDORS[0],
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank NEFT',
      invoiceRef: '',
      receiptUrl: '',
      notes: ''
    });
    setIsRecordModalOpen(true);
  };

  // Vendor Option Change Handler
  const handleVendorOptionChange = (val) => {
    setSelectedVendorOption(val);
    if (val === 'Other / Custom Vendor') {
      setFormData((prev) => ({ ...prev, vendor: customVendorName }));
    } else {
      setFormData((prev) => ({ ...prev, vendor: val }));
    }
  };

  // Custom Vendor Name Handler
  const handleCustomVendorChange = (val) => {
    setCustomVendorName(val);
    setFormData((prev) => ({ ...prev, vendor: val }));
  };

  // Handle Receipt File Upload
  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast('Receipt file size must be less than 10MB', 'error');
      return;
    }

    setUploadingReceipt(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await apiRequest('/media/upload', {
        method: 'POST',
        body: uploadData
      });

      if (res.url) {
        setFormData((prev) => ({ ...prev, receiptUrl: res.url }));
        addToast('Receipt document uploaded securely', 'success');
      } else {
        throw new Error('Upload succeeded but no asset URL was returned');
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to upload receipt', 'error');
    } finally {
      setUploadingReceipt(false);
    }
  };

  // Validate Expense Form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = 'Description must be at least 3 characters long.';
    }
    if (!formData.vendor.trim()) {
      errors.vendor = 'Please specify a valid vendor or payee name.';
    }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt < 1) {
      errors.amount = 'Amount must be at least ₹1.';
    } else if (amt > 10000000) {
      errors.amount = 'Amount exceeds maximum limit of ₹1,00,00,000 (1 Crore).';
    }
    if (!formData.category) {
      errors.category = 'Mandatory expense category required.';
    }
    if (!formData.invoiceRef.trim()) {
      errors.invoiceRef = 'Invoice / Reference number is required for audit trail.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Expense Form
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please correct the validation errors in the form', 'error');
      return;
    }

    setSubmittingExpense(true);
    try {
      await apiRequest('/finance', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          vendor: formData.vendor.trim(),
          amount: parseFloat(formData.amount),
          date: formData.date,
          paymentMethod: formData.paymentMethod,
          invoiceRef: formData.invoiceRef.trim(),
          receiptUrl: formData.receiptUrl || null,
          notes: formData.notes?.trim() || null
        })
      });

      addToast('Expense recorded and entered into universal audit queue', 'success');
      setIsRecordModalOpen(false);
      fetchFinance();
    } catch (err) {
      addToast(err.message || 'Failed to record expense', 'error');
    } finally {
      setSubmittingExpense(false);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense line item permanently?')) return;
    try {
      await apiRequest(`/finance/${id}`, { method: 'DELETE' });
      addToast('Expense item removed', 'success');
      fetchFinance();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
    }
  };

  // Open Approval Modal
  const openApprovalModal = (item, stageRole) => {
    setActiveApprovalItem(item);
    setApprovalRole(stageRole);
    if (stageRole === 'DIRECTOR') {
      setApproverName('Dr. Narayana Murthy, MD');
    } else {
      setApproverName('Dr. C. Shanthi, Pathologist');
    }
    setApprovalNotes('');
    setIsApproveModalOpen(true);
  };

  // Submit Multi-Level Approval
  const handleSubmitApproval = async (e) => {
    e.preventDefault();
    if (!activeApprovalItem) return;

    if (!approverName.trim()) {
      addToast('Approver name is required', 'error');
      return;
    }

    setSubmittingApproval(true);
    try {
      await apiRequest(`/finance/approve/${activeApprovalItem.id}`, {
        method: 'POST',
        body: JSON.stringify({
          roleType: approvalRole,
          approverName: approverName.trim(),
          notes: approvalNotes.trim() || undefined
        })
      });

      addToast(
        approvalRole === 'DIRECTOR'
          ? `Item officially disbursed under Director authorization!`
          : `Item supervisor-verified and forwarded to Director for disbursement`,
        'success'
      );
      setIsApproveModalOpen(false);
      fetchFinance();
    } catch (err) {
      addToast(err.message || 'Approval authorization failed', 'error');
    } finally {
      setSubmittingApproval(false);
    }
  };

  // Batch Approve All Pending
  const handleBatchApprove = async (roleType) => {
    const roleLabel = roleType === 'DIRECTOR' ? 'Director Sign-off & Disbursement' : 'Supervisor Verification';
    if (!window.confirm(`Batch approve all pending items in queue with ${roleLabel}?`)) return;

    try {
      const approver =
        roleType === 'DIRECTOR' ? 'Dr. Narayana Murthy, MD (Director)' : 'Dr. C. Shanthi, Pathologist (Supervisor)';
      const res = await apiRequest('/finance/batch-approve', {
        method: 'POST',
        body: JSON.stringify({
          roleType,
          approverName: approver,
          notes: `Batch processed via Master Finance Ledger`
        })
      });

      addToast(res.message || 'Batch approved successfully', 'success');
      fetchFinance();
    } catch (err) {
      addToast(err.message || 'Batch approval failed', 'error');
    }
  };

  // Filtered Expenses for Ledger Table
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.expenseCode && item.expenseCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.invoiceRef && item.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'DISBURSED' && (item.approvalStage === 'DISBURSED' || item.status === 'paid')) ||
      (statusFilter === 'SUPERVISOR_VERIFIED' && item.approvalStage === 'SUPERVISOR_VERIFIED') ||
      (statusFilter === 'PENDING' && (item.approvalStage === 'PENDING_SUPERVISOR' || item.status === 'pending'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      addToast('No expense records to export', 'error');
      return;
    }

    const headers = [
      'Expense Code',
      'Item Description',
      'Category',
      'Vendor / Payee',
      'Amount (INR)',
      'Invoice Ref',
      'Date',
      'Payment Method',
      'Approval Stage',
      'Supervisor Approved',
      'Supervisor Signer',
      'Director Approved',
      'Director Signer'
    ];

    const rows = expenses.map((e) => [
      `"${e.expenseCode || ''}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.vendor.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.invoiceRef || ''}"`,
      `"${formatDate(e.date)}"`,
      `"${e.paymentMethod || 'Bank NEFT'}"`,
      `"${e.approvalStage || 'DISBURSED'}"`,
      e.supervisorApproved ? 'YES' : 'NO',
      `"${e.supervisorName || ''}"`,
      e.directorApproved ? 'YES' : 'NO',
      `"${e.directorName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rithanya_Hospital_Master_Ledger_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedMonthName = new Date(`${selectedMonth}-01`).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Consolidated Hospital Master Finance Ledger"
        subtitle={`Total Outflow Aggregation (Staff Payroll + Facility Rent + Vendor Supplies) · ${formattedMonthName}`}
        actions={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Month Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '4px 10px', borderRadius: 8, border: '1px solid var(--line)' }}>
              <Calendar size={14} style={{ color: 'var(--red-700)' }} />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--ink)'
                }}
              />
            </div>

            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            <button type="button" className="btn btn-primary btn-sm" onClick={() => openRecordModal()}>
              <Plus size={16} />
              <span>Record Expense</span>
            </button>
          </div>
        }
      />

      <div className="admin-content">
        {/* ========================================================================= */}
        {/* 1. REAL-TIME CONSOLIDATED FINANCIAL OUTFLOW DASHBOARD (MASTER KPIS) */}
        {/* ========================================================================= */}
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          {/* KPI 1: TOTAL HOSPITAL OUTFLOW */}
          <div
            className="kpi-card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
              border: '1px solid rgba(197, 14, 31, 0.2)',
              boxShadow: '0 4px 16px rgba(197, 14, 31, 0.06)'
            }}
          >
            <div className="kpi-card-info">
              <p style={{ fontWeight: 700, color: 'var(--red-700)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Hospital Outflow
              </p>
              <h2 style={{ color: 'var(--red-700)', fontSize: 26, margin: '4px 0', fontWeight: 800 }}>
                {formatCurrency(kpis.totalOutflow)}
              </h2>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Combined Payroll + Facility Rent + Vendor Supplies
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ background: '#fef2f2', color: '#c50e1f' }}>
              <IndianRupee size={26} />
            </div>
          </div>

          {/* KPI 2: STAFF PAYROLL OUTFLOW */}
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Staff Payroll Outflow</p>
              <h3 style={{ color: '#0284c7', fontSize: 22, margin: '4px 0' }}>
                {formatCurrency(kpis.payrollOutflow)}
              </h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                {kpis.totalStaffCount} Active Hospital Employees
              </span>
            </div>
            <div className="kpi-icon-wrap blue" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Users size={22} />
            </div>
          </div>

          {/* KPI 3: FACILITY RENT & REAL ESTATE */}
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Facility Rent & Overheads</p>
              <h3 style={{ color: '#d97706', fontSize: 22, margin: '4px 0' }}>
                {formatCurrency(kpis.rentOutflow)}
              </h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Building Premises, Power & Utilities
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Building size={22} />
            </div>
          </div>

          {/* KPI 4: VENDOR PROCUREMENT */}
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Vendor Procurement</p>
              <h3 style={{ color: '#059669', fontSize: 22, margin: '4px 0' }}>
                {formatCurrency(kpis.vendorOutflow)}
              </h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Supplies, Reagents & Consumables
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. NAVIGATION TAB STRIP */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--line)',
            paddingBottom: 12,
            marginBottom: 20,
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'ledger' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('ledger')}
            >
              <FileText size={15} />
              <span>Master Ledger ({expenses.length})</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'approvals' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('approvals')}
              style={{ position: 'relative' }}
            >
              <ShieldCheck size={15} />
              <span>Universal Approval Pipeline</span>
              {kpis.pendingApprovalCount > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: activeTab === 'approvals' ? '#fff' : '#c50e1f',
                    color: activeTab === 'approvals' ? '#c50e1f' : '#fff',
                    borderRadius: 9999,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  {kpis.pendingApprovalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'facility' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('facility')}
            >
              <Building size={15} />
              <span>Facility Rent & Premises ({facilityRentExpenses.length})</span>
            </button>
          </div>

          {activeTab === 'approvals' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleBatchApprove('SUPERVISOR')}
              >
                <CheckCircle2 size={14} style={{ color: '#0284c7' }} />
                <span>Verify All (Supervisor)</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleBatchApprove('DIRECTOR')}
              >
                <ShieldCheck size={14} />
                <span>Sign & Disburse All (Director)</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MASTER EXPENDITURE LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div>
            {/* Filter Bar */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
                background: '#fff',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid var(--line)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
                <Search size={16} style={{ color: 'var(--ink-light)' }} />
                <input
                  type="text"
                  placeholder="Search item, vendor, code, or invoice ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: 13,
                    color: 'var(--ink)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Filter size={14} style={{ color: 'var(--ink-light)' }} />
                <span style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 600 }}>Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-control"
                  style={{ height: 32, fontSize: 12, padding: '0 8px', width: 'auto' }}
                >
                  <option value="ALL">All Categories</option>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 600 }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-control"
                  style={{ height: 32, fontSize: 12, padding: '0 8px', width: 'auto' }}
                >
                  <option value="ALL">All Stages</option>
                  <option value="PENDING">Pending Audit</option>
                  <option value="SUPERVISOR_VERIFIED">Supervisor Verified</option>
                  <option value="DISBURSED">Fully Disbursed</option>
                </select>
              </div>

              {(searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Master Ledger Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ledger Code</th>
                    <th>Item Description</th>
                    <th>Category</th>
                    <th>Vendor / Payee</th>
                    <th>Amount</th>
                    <th>Invoice Ref</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Approval Status</th>
                    <th>Receipt</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-light)' }}>
                        <div className="admin-spinner" style={{ margin: '0 auto 10px' }} />
                        Loading Master Ledger for {formattedMonthName}...
                      </td>
                    </tr>
                  ) : filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-light)' }}>
                        <FileText size={36} style={{ color: 'var(--line)', margin: '0 auto 12px', display: 'block' }} />
                        <strong style={{ display: 'block', fontSize: 15, color: 'var(--ink)' }}>No Outflow Records Found</strong>
                        <span>No expense entries recorded matching current filters for {formattedMonthName}.</span>
                        <div style={{ marginTop: 14 }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openRecordModal()}
                          >
                            <Plus size={14} />
                            <span>Record First Expense</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>
                          <strong style={{ color: 'var(--red-700)', fontSize: 12, fontFamily: 'monospace' }}>
                            {exp.expenseCode}
                          </strong>
                        </td>
                        <td>
                          <div>
                            <strong>{exp.name}</strong>
                            {exp.notes && (
                              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{exp.notes}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: exp.category === 'Facility Rent' ? '#fef3c7' : '#f3f4f6',
                              color: exp.category === 'Facility Rent' ? '#92400e' : '#374151',
                              fontWeight: 600,
                              fontSize: 11
                            }}
                          >
                            {exp.category}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{exp.vendor}</span>
                        </td>
                        <td>
                          <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                            {formatCurrency(exp.amount)}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--ink-light)' }}>
                            {exp.invoiceRef || '—'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                            {exp.paymentMethod || 'Bank NEFT'}
                          </span>
                        </td>
                        <td>{formatDate(exp.date)}</td>
                        <td>
                          {exp.approvalStage === 'DISBURSED' || exp.directorApproved ? (
                            <span
                              className="badge"
                              style={{
                                background: '#ecfdf5',
                                color: '#065f46',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11
                              }}
                              title={`Signed off by ${exp.directorName || 'Director'}`}
                            >
                              <CheckCircle2 size={12} /> Disbursed
                            </span>
                          ) : exp.approvalStage === 'SUPERVISOR_VERIFIED' || exp.supervisorApproved ? (
                            <span
                              className="badge"
                              style={{
                                background: '#eff6ff',
                                color: '#1e40af',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11
                              }}
                              title={`Verified by ${exp.supervisorName || 'Supervisor'}`}
                            >
                              <Clock size={12} /> Sup. Verified
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: '#fef2f2',
                                color: '#991b1b',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11
                              }}
                            >
                              <AlertTriangle size={12} /> Pending Audit
                            </span>
                          )}
                        </td>
                        <td>
                          {exp.receiptUrl ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11 }}
                              onClick={() => setPreviewReceiptUrl(exp.receiptUrl)}
                              title="Inspect Uploaded Receipt"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>No file</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            {(!exp.supervisorApproved || !exp.directorApproved) && (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: 11, color: '#0284c7' }}
                                onClick={() =>
                                  openApprovalModal(
                                    {
                                      id: exp.id,
                                      type: 'VENDOR_EXPENSE',
                                      title: exp.name,
                                      category: exp.category,
                                      payee: exp.vendor,
                                      amount: exp.amount,
                                      approvalStage: exp.approvalStage
                                    },
                                    exp.supervisorApproved ? 'DIRECTOR' : 'SUPERVISOR'
                                  )
                                }
                                title="Approve Line Item"
                              >
                                <ShieldCheck size={13} />
                                <span>{exp.supervisorApproved ? 'Sign' : 'Verify'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#d32f2f', padding: '3px 6px' }}
                              onClick={() => handleDeleteExpense(exp.id)}
                              title="Delete Item"
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: UNIVERSAL MULTI-LEVEL APPROVAL & DISBURSEMENT PIPELINE */}
        {/* ========================================================================= */}
        {activeTab === 'approvals' && (
          <div>
            <div
              style={{
                background: 'linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%)',
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid #bbf7d0',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 14
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={20} /> Universal Multi-Level Audit & Disbursement Engine
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#15803d' }}>
                  Both Monthly Staff Payroll Batches and Vendor Invoices require Level 1 Supervisor Verification followed by Level 2 Director Authorization prior to bank release.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleBatchApprove('SUPERVISOR')}
                >
                  <CheckCircle2 size={14} style={{ color: '#0284c7' }} />
                  <span>Verify All as Supervisor</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleBatchApprove('DIRECTOR')}
                >
                  <ShieldCheck size={14} />
                  <span>Authorize & Disburse All (Director)</span>
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Queue ID</th>
                    <th>Type</th>
                    <th>Item Title & Beneficiary</th>
                    <th>Category</th>
                    <th>Amount (INR)</th>
                    <th>Level 1: Supervisor Audit</th>
                    <th>Level 2: Director Disbursement</th>
                    <th style={{ textAlign: 'right' }}>Authorization Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalQueue.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: 48, color: 'var(--ink-light)' }}>
                        <CheckCircle2 size={40} style={{ color: '#16a34a', margin: '0 auto 12px', display: 'block' }} />
                        <strong style={{ fontSize: 16, color: 'var(--ink)', display: 'block' }}>Universal Audit Queue Clear!</strong>
                        <span>All staff payroll batches and vendor invoices for {formattedMonthName} have been fully verified and disbursed.</span>
                      </td>
                    </tr>
                  ) : (
                    approvalQueue.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
                            {item.id}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: item.type === 'PAYROLL_BATCH' ? '#e0f2fe' : '#fef3c7',
                              color: item.type === 'PAYROLL_BATCH' ? '#0369a1' : '#b45309',
                              fontWeight: 700,
                              fontSize: 10
                            }}
                          >
                            {item.type === 'PAYROLL_BATCH' ? 'STAFF PAYROLL' : 'VENDOR INVOICE'}
                          </span>
                        </td>
                        <td>
                          <div>
                            <strong>{item.title}</strong>
                            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                              Payee: <strong>{item.payee}</strong>
                              {item.invoiceRef && ` · Ref: ${item.invoiceRef}`}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-secondary" style={{ fontSize: 11 }}>
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: 14, color: 'var(--red-700)' }}>
                            {formatCurrency(item.amount)}
                          </strong>
                        </td>
                        {/* Supervisor Verification Status */}
                        <td>
                          {item.supervisorApproved ? (
                            <div>
                              <span
                                className="badge"
                                style={{ background: '#ecfdf5', color: '#166534', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                <CheckCircle2 size={12} /> Verified
                              </span>
                              <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>
                                {item.supervisorName || 'Supervisor'}
                              </div>
                            </div>
                          ) : (
                            <span
                              className="badge"
                              style={{ background: '#fef2f2', color: '#991b1b', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <Clock size={12} /> Awaiting Review
                            </span>
                          )}
                        </td>
                        {/* Director Authorization Status */}
                        <td>
                          {item.directorApproved ? (
                            <div>
                              <span
                                className="badge"
                                style={{ background: '#ecfdf5', color: '#166534', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                <CheckCircle2 size={12} /> Disbursed
                              </span>
                              <div style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 2 }}>
                                {item.directorName || 'Director'}
                              </div>
                            </div>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: item.supervisorApproved ? '#eff6ff' : '#f9fafb',
                                color: item.supervisorApproved ? '#1d4ed8' : '#9ca3af',
                                fontSize: 11,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Clock size={12} /> {item.supervisorApproved ? 'Ready for Seal' : 'Locked'}
                            </span>
                          )}
                        </td>
                        {/* Action Buttons */}
                        <td style={{ textAlign: 'right' }}>
                          {!item.supervisorApproved ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#0284c7', borderColor: '#0284c7' }}
                              onClick={() => openApprovalModal(item, 'SUPERVISOR')}
                            >
                              <CheckCircle2 size={13} />
                              <span>Verify (Supervisor)</span>
                            </button>
                          ) : !item.directorApproved ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => openApprovalModal(item, 'DIRECTOR')}
                            >
                              <ShieldCheck size={13} />
                              <span>Disburse (Director)</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FACILITY RENT & REAL ESTATE OVERHEADS */}
        {/* ========================================================================= */}
        {activeTab === 'facility' && (
          <div>
            <div
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: 10,
                border: '1px solid var(--line)',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: 'var(--ink)' }}>
                  Hospital Premises Lease & Overhead Accounts
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-soft)' }}>
                  All facility rental obligations, municipal utilities, biomedical incinerator contracts, and heavy diagnostic AMC contracts.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Monthly Premises Total
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706' }}>
                    {formatCurrency(kpis.rentOutflow)}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openRecordModal('Facility Rent')}
                >
                  <Plus size={15} />
                  <span>Add Facility Expense</span>
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ledger Code</th>
                    <th>Premises Line Item</th>
                    <th>Sub-Category</th>
                    <th>Property Landlord / Vendor</th>
                    <th>Amount</th>
                    <th>Invoice / Agreement Ref</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityRentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-light)' }}>
                        <Building size={36} style={{ color: 'var(--line)', margin: '0 auto 10px', display: 'block' }} />
                        <strong style={{ fontSize: 15, display: 'block', color: 'var(--ink)' }}>No Facility Overhead Entries</strong>
                        <span>No premises rent or maintenance logged for {formattedMonthName}.</span>
                        <div style={{ marginTop: 12 }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openRecordModal('Facility Rent')}
                          >
                            <Plus size={14} />
                            <span>Add Premises Rent Record</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    facilityRentExpenses.map((rent) => (
                      <tr key={rent.id}>
                        <td>
                          <strong style={{ color: 'var(--red-700)', fontSize: 12, fontFamily: 'monospace' }}>
                            {rent.expenseCode}
                          </strong>
                        </td>
                        <td>
                          <strong>{rent.name}</strong>
                          {rent.notes && (
                            <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{rent.notes}</div>
                          )}
                        </td>
                        <td>
                          <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: 11 }}>
                            {rent.category}
                          </span>
                        </td>
                        <td>
                          <strong>{rent.vendor}</strong>
                        </td>
                        <td>
                          <strong style={{ fontSize: 14 }}>{formatCurrency(rent.amount)}</strong>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{rent.invoiceRef || '—'}</span>
                        </td>
                        <td>{formatDate(rent.date)}</td>
                        <td>
                          <span className={`status-pill ${rent.approvalStage === 'DISBURSED' ? 'paid' : 'pending'}`}>
                            {rent.approvalStage || rent.status}
                          </span>
                        </td>
                        <td>
                          {rent.receiptUrl ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11 }}
                              onClick={() => setPreviewReceiptUrl(rent.receiptUrl)}
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#d32f2f', padding: '3px 6px' }}
                            onClick={() => handleDeleteExpense(rent.id)}
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: STRICT EXPENSE ENTRY & VALIDATION ENGINE */}
        {/* ========================================================================= */}
        <Modal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          title="Record Hospital Outflow / Vendor Expenditure"
        >
          <form onSubmit={handleSaveExpense}>
            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Expense Description * <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>(Min 3 chars)</span>
              </label>
              <input
                type="text"
                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. Diagnostic Bio-analyzer Reagents & Test Packs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {formErrors.name && (
                <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.name}</div>
              )}
            </div>

            {/* Category & Amount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Mandatory Category *</label>
                <select
                  className={`form-control ${formErrors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.category}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Amount (INR) * <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>(₹1 - ₹1,00,00,000)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000000"
                  step="0.01"
                  className={`form-control ${formErrors.amount ? 'is-invalid' : ''}`}
                  placeholder="e.g. 45000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                {formErrors.amount && (
                  <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.amount}</div>
                )}
              </div>
            </div>

            {/* Vendor Dropdown & Custom Option */}
            <div className="form-group">
              <label className="form-label">Vendor / Payee Entity *</label>
              <select
                className="form-control"
                value={selectedVendorOption}
                onChange={(e) => handleVendorOptionChange(e.target.value)}
              >
                {CURATED_VENDORS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              {selectedVendorOption === 'Other / Custom Vendor' && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    className={`form-control ${formErrors.vendor ? 'is-invalid' : ''}`}
                    placeholder="Enter Custom Vendor / Beneficiary Name"
                    value={customVendorName}
                    onChange={(e) => handleCustomVendorChange(e.target.value)}
                    required
                  />
                </div>
              )}
              {formErrors.vendor && (
                <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.vendor}</div>
              )}
            </div>

            {/* Invoice Ref & Payment Method */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">
                  Invoice / Bill Reference * <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>(Audit Trail)</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors.invoiceRef ? 'is-invalid' : ''}`}
                  placeholder="e.g. INV-2026-SEP-0842"
                  value={formData.invoiceRef}
                  onChange={(e) => setFormData({ ...formData, invoiceRef: e.target.value })}
                  required
                />
                {formErrors.invoiceRef && (
                  <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{formErrors.invoiceRef}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Disbursement Method</label>
                <select
                  className="form-control"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="Bank NEFT">Bank NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Corporate UPI">Corporate UPI</option>
                  <option value="Petty Cash">Petty Cash</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Expense Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {/* Receipt Image / Document Upload Support */}
            <div className="form-group">
              <label className="form-label">Receipt / Bill Document (Image or PDF)</label>
              <div
                style={{
                  border: '1px dashed var(--line)',
                  borderRadius: 8,
                  padding: 14,
                  background: '#fafafa',
                  textAlign: 'center'
                }}
              >
                {formData.receiptUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileCheck size={18} style={{ color: '#16a34a' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                        Document attached: {formData.receiptUrl.split('/').pop()}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 11, padding: '2px 8px' }}
                      onClick={() => setFormData({ ...formData, receiptUrl: '' })}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="receiptUploadInput"
                      style={{ display: 'none' }}
                      accept="image/*,.pdf"
                      onChange={handleReceiptUpload}
                      disabled={uploadingReceipt}
                    />
                    <label
                      htmlFor="receiptUploadInput"
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Upload size={14} />
                      <span>{uploadingReceipt ? 'Uploading Document...' : 'Upload Receipt File'}</span>
                    </label>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>
                      Supports PNG, JPG, WEBP, PDF up to 10MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Internal Audit Notes & Justification</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Optional clinical purpose or procurement notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRecordModalOpen(false)}
                disabled={submittingExpense}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submittingExpense}>
                <span>{submittingExpense ? 'Recording...' : 'Submit to Universal Pipeline'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* ========================================================================= */}
        {/* MODAL 2: UNIVERSAL APPROVAL & DISBURSEMENT AUTHORIZATION */}
        {/* ========================================================================= */}
        <Modal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          title={`Digital Authorization Seal: ${approvalRole === 'DIRECTOR' ? 'Director Sign-off & Disbursement' : 'Supervisor Verification'}`}
        >
          {activeApprovalItem && (
            <form onSubmit={handleSubmitApproval}>
              <div
                style={{
                  marginBottom: 16,
                  padding: 14,
                  background: approvalRole === 'DIRECTOR' ? '#faf5ff' : '#f0f9ff',
                  borderRadius: 8,
                  border: `1px solid ${approvalRole === 'DIRECTOR' ? '#d8b4fe' : '#bae6fd'}`
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: approvalRole === 'DIRECTOR' ? '#6b21a8' : '#0369a1' }}>
                  {approvalRole === 'DIRECTOR'
                    ? 'Managing Director Executive Seal & Bank Release Authorization'
                    : 'Level 1: Hospital Clinical / Financial Supervisor Verification'}
                </div>
                <div style={{ fontSize: 13, marginTop: 6, color: 'var(--ink)' }}>
                  Authorizing: <strong>{activeApprovalItem.title}</strong>
                </div>
                <div style={{ fontSize: 12, marginTop: 4, color: 'var(--ink-soft)' }}>
                  Beneficiary: <strong>{activeApprovalItem.payee}</strong> · Amount:{' '}
                  <strong style={{ color: 'var(--red-700)', fontSize: 14 }}>
                    {formatCurrency(activeApprovalItem.amount)}
                  </strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Signer / Approver Official Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  placeholder="e.g. Dr. Narayana Murthy, MD"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Audit Remarks / Clearance Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="e.g. Invoices checked against purchase orders and verified."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsApproveModalOpen(false)}
                  disabled={submittingApproval}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    background: approvalRole === 'DIRECTOR' ? '#7e22ce' : 'var(--red-700)',
                    borderColor: approvalRole === 'DIRECTOR' ? '#7e22ce' : 'var(--red-700)'
                  }}
                  disabled={submittingApproval}
                >
                  <ShieldCheck size={16} />
                  <span>
                    {submittingApproval
                      ? 'Authorizing...'
                      : approvalRole === 'DIRECTOR'
                      ? 'Affix Director Seal & Disburse'
                      : 'Affix Supervisor Verification'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* ========================================================================= */}
        {/* MODAL 3: RECEIPT VIEWER */}
        {/* ========================================================================= */}
        <Modal
          isOpen={!!previewReceiptUrl}
          onClose={() => setPreviewReceiptUrl(null)}
          title="Expense Receipt & Audit Document"
        >
          {previewReceiptUrl && (
            <div>
              <div
                style={{
                  maxHeight: '65vh',
                  overflowY: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#f9fafb',
                  borderRadius: 8,
                  padding: 16
                }}
              >
                {previewReceiptUrl.endsWith('.pdf') ? (
                  <iframe
                    src={previewReceiptUrl}
                    title="Receipt Document"
                    style={{ width: '100%', height: 480, border: 'none' }}
                  />
                ) : (
                  <img
                    src={previewReceiptUrl}
                    alt="Expense Receipt"
                    style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 6 }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <a
                  href={previewReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <ExternalLink size={14} />
                  <span>Open in Full Tab</span>
                </a>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setPreviewReceiptUrl(null)}
                >
                  Close Viewer
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
