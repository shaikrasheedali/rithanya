import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  ShieldCheck,
  BookmarkCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Package,
  Layers,
  FlaskConical,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

// Tailored clinical styling per blood group pair
const GROUP_CARD_THEMES = {
  'O+': { bg: '#f0f9ff', border: '#38bdf8', text: '#0369a1', badge: 'bg-sky-100 text-sky-800' },
  'O-': { bg: '#e0f2fe', border: '#0284c7', text: '#0369a1', badge: 'bg-sky-200 text-sky-900' },
  'A+': { bg: '#fefce8', border: '#facc15', text: '#854d0e', badge: 'bg-yellow-100 text-yellow-800' },
  'A-': { bg: '#fef9c3', border: '#eab308', text: '#854d0e', badge: 'bg-yellow-200 text-yellow-900' },
  'B+': { bg: '#fff1f2', border: '#f87171', text: '#991b1b', badge: 'bg-rose-100 text-rose-800' },
  'B-': { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', badge: 'bg-rose-200 text-rose-900' },
  'AB+': { bg: '#ffffff', border: '#cbd5e1', text: '#1e293b', badge: 'bg-slate-100 text-slate-800' },
  'AB-': { bg: '#ffffff', border: '#94a3b8', text: '#0f172a', badge: 'bg-slate-200 text-slate-900' }
};

export default function InventoryPage() {
  const { addToast } = useToast();
  const [primarySection, setPrimarySection] = useState('inventory'); // 'inventory', 'lab', 'audit'
  const [activeTab, setActiveTab] = useState('grid'); // 'grid', 'reservations', 'bags', 'serology', 'emptyBags', 'testKits', 'logs'
  const [stocks, setStocks] = useState([]);
  const [categorizationGrid, setCategorizationGrid] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [bags, setBags] = useState([]);
  const [emptyBags, setEmptyBags] = useState([]);
  const [testKits, setTestKits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [totals, setTotals] = useState({
    totalUnits: 0,
    totalReserved: 0,
    availableUnits: 0,
    criticalAlerts: 0,
    quarantineUnits: 0,
    emptyBagsTotal: 0,
    testKitsRemainingTotal: 0
  });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [isRegisterBagOpen, setIsRegisterBagOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [isRestockEmptyBagOpen, setIsRestockEmptyBagOpen] = useState(false);
  const [isRestockTestKitOpen, setIsRestockTestKitOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isDispenseOpen, setIsDispenseOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [reserveForm, setReserveForm] = useState({
    bloodGroup: 'O+',
    units: 1,
    patientId: '',
    patientName: '',
    holdHours: 24,
    notes: 'Scheduled Daycare Transfusion reservation'
  });

  const [bagForm, setBagForm] = useState({
    bagId: '',
    bloodGroup: 'O+',
    componentType: 'Packed Red Cells (PRBC)',
    bagType: 'Triple (3D)',
    volumeMl: 350,
    donorCode: '',
    donorName: '',
    collectionDate: new Date().toISOString().slice(0, 10),
    expiryDays: 35,
    location: 'Quarantine Section Q-01',
    notes: 'Voluntary blood donor collection'
  });

  const [screeningTargetBag, setScreeningTargetBag] = useState(null);
  const [screenForm, setScreenForm] = useState({
    hivResult: 'NON_REACTIVE',
    hcvResult: 'NON_REACTIVE',
    hbsagResult: 'NON_REACTIVE',
    vdrlResult: 'NON_REACTIVE',
    screenedBy: 'Dr. C. Shanthi, Pathologist',
    notes: 'Quadruple serology clearance protocol verified'
  });

  const [selectedEmptyBag, setSelectedEmptyBag] = useState(null);
  const [emptyBagRestockQty, setEmptyBagRestockQty] = useState(25);

  const [selectedTestKit, setSelectedTestKit] = useState(null);
  const [kitRestockForm, setKitRestockForm] = useState({ addedTests: 50, lotNumber: '', expiryDate: '' });

  const [loadForm, setLoadForm] = useState({ group: 'O+', units: 4, source: 'District Blood Center Khammam' });
  const [dispenseForm, setDispenseForm] = useState({ group: 'O+', units: 1, patientId: '', notes: 'Immediate Daycare Transfusion' });

  // Bag filter
  const [bagFilterStage, setBagFilterStage] = useState('ALL');
  const [bagFilterGroup, setBagFilterGroup] = useState('ALL');

  const fetchInventory = async () => {
    try {
      const [invRes, patientsRes] = await Promise.all([
        apiRequest('/inventory'),
        apiRequest('/patients')
      ]);

      const data = invRes.data || {};
      setStocks(data.stocks || []);
      setCategorizationGrid(data.categorizationGrid || []);
      setReservations(data.reservations || []);
      setBags(data.bags || []);
      setEmptyBags(data.emptyBags || []);
      setTestKits(data.testKits || []);
      setLogs(data.logs || []);
      setTotals(data.totals || { totalUnits: 0, totalReserved: 0, availableUnits: 0, criticalAlerts: 0 });
      setPatients(patientsRes.data || []);

      if (patientsRes.data?.length > 0 && !dispenseForm.patientId) {
        setDispenseForm((prev) => ({ ...prev, patientId: patientsRes.data[0].id }));
      }
      if (patientsRes.data?.length > 0 && !reserveForm.patientId) {
        setReserveForm((prev) => ({
          ...prev,
          patientId: patientsRes.data[0].id,
          patientName: patientsRes.data[0].name
        }));
      }
    } catch (err) {
      console.error('Failed to load blood inventory:', err);
      addToast(err.message || 'Error loading inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Quick helper to fill patient name when selected from dropdown
  const handleReservePatientSelect = (e) => {
    const pId = e.target.value;
    const pat = patients.find((p) => p.id === pId);
    setReserveForm((prev) => ({
      ...prev,
      patientId: pId,
      patientName: pat ? `${pat.name} (${pat.patientCode})` : prev.patientName
    }));
  };

  // Submit Blood Reservation (Req 6)
  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/inventory/reserve', {
        method: 'POST',
        body: JSON.stringify(reserveForm)
      });
      addToast(`Reserved ${reserveForm.units} unit(s) of ${reserveForm.bloodGroup} for ${reserveForm.patientName}!`, 'success');
      setIsReserveOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to reserve blood stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Release / Cancel Reservation (Req 6)
  const handleReleaseReservation = async (reservationId, code) => {
    if (!window.confirm(`Are you sure you want to release reservation ${code}? Units will return to available stock.`)) return;
    try {
      await apiRequest(`/inventory/unreserve/${reservationId}`, { method: 'POST' });
      addToast(`Reservation ${code} released. Stock restored!`, 'success');
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to release reservation', 'error');
    }
  };

  // Fulfill Reservation (Req 6)
  const handleFulfillReservation = async (reservationId, code, patientName) => {
    if (!window.confirm(`Confirm transfusion dispensation for reservation ${code} (${patientName})?`)) return;
    try {
      await apiRequest(`/inventory/fulfill-reservation/${reservationId}`, { method: 'POST' });
      addToast(`Reservation ${code} fulfilled and blood units dispensed!`, 'success');
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to fulfill reservation', 'error');
    }
  };

  // Register New Bag Unit (Req 7)
  const handleRegisterBag = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/inventory/bags', {
        method: 'POST',
        body: JSON.stringify(bagForm)
      });
      addToast(`New bag registered and safely placed in Quarantine for serology panel!`, 'success');
      setIsRegisterBagOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to register blood bag', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Serology Screening for a Quarantine Bag
  const openScreeningModal = (bag) => {
    setScreeningTargetBag(bag);
    setScreenForm({
      hivResult: 'NON_REACTIVE',
      hcvResult: 'NON_REACTIVE',
      hbsagResult: 'NON_REACTIVE',
      vdrlResult: 'NON_REACTIVE',
      screenedBy: 'Dr. C. Shanthi, Pathologist',
      notes: `Verified clean clearance panel for ${bag.bagId}`
    });
    setIsScreenModalOpen(true);
  };

  // Submit Serology Screening (Req 7)
  const handleScreenSubmit = async (e) => {
    e.preventDefault();
    if (!screeningTargetBag) return;
    setSubmitting(true);
    try {
      const res = await apiRequest(`/inventory/bags/${screeningTargetBag.id}/screen`, {
        method: 'PUT',
        body: JSON.stringify(screenForm)
      });
      addToast(res.message || 'Screening recorded successfully!', 'success');
      setIsScreenModalOpen(false);
      setScreeningTargetBag(null);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to submit serology screening', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Restock Empty Bags (Req 7)
  const handleRestockEmptyBag = async (e) => {
    e.preventDefault();
    if (!selectedEmptyBag) return;
    setSubmitting(true);
    try {
      await apiRequest(`/inventory/empty-bags/${selectedEmptyBag.id}`, {
        method: 'PUT',
        body: JSON.stringify({ restockQty: emptyBagRestockQty })
      });
      addToast(`Restocked +${emptyBagRestockQty} units of ${selectedEmptyBag.bagType}!`, 'success');
      setIsRestockEmptyBagOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to restock empty bags', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Restock Test Kits (Req 7)
  const handleRestockTestKit = async (e) => {
    e.preventDefault();
    if (!selectedTestKit) return;
    setSubmitting(true);
    try {
      await apiRequest(`/inventory/test-kits/${selectedTestKit.id}/restock`, {
        method: 'PUT',
        body: JSON.stringify(kitRestockForm)
      });
      addToast(`Restocked ${kitRestockForm.addedTests} tests for ${selectedTestKit.assayName}!`, 'success');
      setIsRestockTestKitOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to restock test kit', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Stock Load (Legacy / Direct)
  const handleQuickLoad = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/inventory/load', {
        method: 'POST',
        body: JSON.stringify(loadForm)
      });
      addToast(`Loaded ${loadForm.units} unit(s) of ${loadForm.group} to Blood Bank reserve!`, 'success');
      setIsLoadOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to load stock', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Immediate Dispensation
  const handleDispense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/inventory/dispense', {
        method: 'POST',
        body: JSON.stringify(dispenseForm)
      });
      addToast(`Dispensed ${dispenseForm.units} unit(s) of ${dispenseForm.group}!`, 'success');
      setIsDispenseOpen(false);
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to dispense blood', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Bags
  const filteredBags = bags.filter((b) => {
    if (bagFilterStage !== 'ALL') {
      if (bagFilterStage === 'EXPIRING_SOON') {
        const daysRemaining = Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysRemaining > 10 || daysRemaining < 0) return false;
      } else if (b.stage !== bagFilterStage) {
        return false;
      }
    }
    if (bagFilterGroup !== 'ALL' && b.bloodGroup !== bagFilterGroup) return false;
    return true;
  });

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Blood Bank Reserve & Transfusion Center"
        subtitle="Live Blood Inventory, Expiry Tracking & Leukodepletion Issuance"
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                fetchInventory();
                addToast('Refreshed live blood inventory & reservations', 'info');
              }}
              title="Refresh live data"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--amber)', color: '#b45309', background: '#fffbeb' }}
              onClick={() => setIsReserveOpen(true)}
            >
              <BookmarkCheck size={14} style={{ color: '#b45309' }} />
              <span style={{ fontWeight: 600 }}>Reserve Blood</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsRegisterBagOpen(true)}
            >
              <Plus size={14} style={{ color: 'var(--navy)' }} />
              <span>Register Donor Bag</span>
            </button>
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
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 20 }}>
          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Total Blood Units</p>
              <h3>{totals.totalUnits}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Across all 8 blood groups
              </span>
            </div>
            <div className="kpi-icon-wrap">
              <Droplet size={22} style={{ color: '#dc2626' }} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Available (Unreserved)</p>
              <h3 style={{ color: '#16a34a' }}>{totals.availableUnits}</h3>
              <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                ✓ Ready for transfusion
              </span>
            </div>
            <div className="kpi-icon-wrap green">
              <ShieldCheck size={22} style={{ color: '#16a34a' }} />
            </div>
          </div>

          <div
            className="kpi-card"
            onClick={() => {
              setPrimarySection('inventory');
              setActiveTab('reservations');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="kpi-card-info">
              <p>Active Reservations</p>
              <h3 style={{ color: '#b45309' }}>{totals.totalReserved}</h3>
              <span style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>
                {reservations.filter((r) => r.status === 'ACTIVE').length} patient holds
              </span>
            </div>
            <div className="kpi-icon-wrap amber">
              <BookmarkCheck size={22} style={{ color: '#b45309' }} />
            </div>
          </div>

          <div
            className="kpi-card"
            onClick={() => {
              setPrimarySection('lab');
              setActiveTab('serology');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="kpi-card-info">
              <p>Quarantine (Unscreened)</p>
              <h3 style={{ color: totals.quarantineUnits > 0 ? '#9333ea' : 'inherit' }}>
                {totals.quarantineUnits}
              </h3>
              <span style={{ fontSize: 12, color: totals.quarantineUnits > 0 ? '#9333ea' : 'var(--ink-soft)' }}>
                {totals.quarantineUnits > 0 ? 'Pending serology clearance' : 'All bags cleared'}
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ background: '#f3e8ff' }}>
              <FlaskConical size={22} style={{ color: '#9333ea' }} />
            </div>
          </div>

          <div
            className="kpi-card"
            onClick={() => {
              setPrimarySection('lab');
              setActiveTab('emptyBags');
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="kpi-card-info">
              <p>Empty Collection Bags</p>
              <h3>{totals.emptyBagsTotal}</h3>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Single, Triple & Quadruple
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ background: '#f1f5f9' }}>
              <Package size={22} style={{ color: '#475569' }} />
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-info">
              <p>Threshold Alerts</p>
              <h3 style={{ color: totals.criticalAlerts > 0 ? 'var(--red-700)' : '#16a34a' }}>
                {totals.criticalAlerts}
              </h3>
              <span style={{ fontSize: 12, color: totals.criticalAlerts > 0 ? 'var(--red-700)' : '#16a34a' }}>
                {totals.criticalAlerts > 0 ? 'Urgent replenishment needed' : 'All stocks optimal'}
              </span>
            </div>
            <div className="kpi-icon-wrap amber">
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>

        {/* BLOOD STOCKS CARDS (MANDATORY ORDER & COLOR CODES: O+, O-, A+, A-, B+, B-, AB+, AB-) */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.3px', color: 'var(--navy)' }}>
              LIVE BLOOD GROUP RESERVES (CLINICAL ORDER & COLOR-CODED CARDS)
            </h3>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              Order: O (+/-) Light Blue · A (+/-) Yellow · B (+/-) Light Red · AB (+/-) White
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
              marginBottom: 24
            }}
          >
            {stocks.map((stock) => {
              const theme = GROUP_CARD_THEMES[stock.group] || {
                bg: '#ffffff',
                border: '#cbd5e1',
                text: '#1e293b'
              };
              const isLow = stock.isLow;

              return (
                <div
                  key={stock.id || stock.group}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    borderRadius: 12,
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: theme.text,
                          letterSpacing: '-0.5px'
                        }}
                      >
                        {stock.group}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 20,
                          background: isLow ? '#fee2e2' : 'rgba(255,255,255,0.85)',
                          color: isLow ? '#b91c1c' : '#15803d',
                          border: `1px solid ${isLow ? '#f87171' : 'rgba(0,0,0,0.1)'}`
                        }}
                      >
                        {isLow ? 'Near Low' : 'Optimal'}
                      </span>
                    </div>

                    {/* Main available count */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: theme.text }}>
                        {stock.availableUnits}{' '}
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)' }}>
                          Available
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                        Total in stock: <strong>{stock.units}</strong> · Reserved:{' '}
                        <strong style={{ color: stock.reservedUnits > 0 ? '#b45309' : 'inherit' }}>
                          {stock.reservedUnits}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div
                    style={{
                      borderTop: `1px dashed ${theme.border}`,
                      paddingTop: 10,
                      marginTop: 6,
                      display: 'flex',
                      gap: 6
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{
                        flex: 1,
                        fontSize: 11.5,
                        padding: '4px 6px',
                        background: '#ffffff',
                        borderColor: theme.border
                      }}
                      onClick={() => {
                        setReserveForm((prev) => ({ ...prev, bloodGroup: stock.group }));
                        setIsReserveOpen(true);
                      }}
                    >
                      <BookmarkCheck size={12} style={{ color: '#b45309' }} />
                      <span>Reserve</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{
                        flex: 1,
                        fontSize: 11.5,
                        padding: '4px 6px'
                      }}
                      onClick={() => {
                        setDispenseForm((prev) => ({ ...prev, group: stock.group }));
                        setIsDispenseOpen(true);
                      }}
                    >
                      <ArrowDownLeft size={12} />
                      <span>Dispense</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TWO-LEVEL TAB ARCHITECTURE (REQ 2: ZERO HORIZONTAL SCROLL) */}
        <div style={{ marginBottom: 20 }}>
          {/* LEVEL 1: PRIMARY DOMAIN SELECTOR */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              background: '#f1f5f9',
              padding: 6,
              borderRadius: 12,
              marginBottom: 12,
              border: '1px solid var(--line)',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${primarySection === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setPrimarySection('inventory');
                if (!['grid', 'reservations', 'bags'].includes(activeTab)) {
                  setActiveTab('grid');
                }
              }}
              style={{
                flex: '1 1 200px',
                justifyContent: 'center',
                padding: '9px 16px',
                borderRadius: 9,
                fontWeight: 700,
                fontSize: 13
              }}
            >
              <Layers size={15} />
              <span>1. Primary Inventory ({totals.totalUnits} Units)</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${primarySection === 'lab' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setPrimarySection('lab');
                if (!['serology', 'emptyBags', 'testKits'].includes(activeTab)) {
                  setActiveTab('serology');
                }
              }}
              style={{
                flex: '1 1 200px',
                justifyContent: 'center',
                padding: '9px 16px',
                borderRadius: 9,
                fontWeight: 700,
                fontSize: 13
              }}
            >
              <FlaskConical size={15} />
              <span>2. Lab Operations ({totals.quarantineUnits} in Quarantine)</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${primarySection === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setPrimarySection('audit');
                setActiveTab('logs');
              }}
              style={{
                flex: '1 1 180px',
                justifyContent: 'center',
                padding: '9px 16px',
                borderRadius: 9,
                fontWeight: 700,
                fontSize: 13
              }}
            >
              <Clock size={15} />
              <span>3. Audit & Logs ({logs.length})</span>
            </button>
          </div>

          {/* LEVEL 2: CONTEXTUAL SUB-TABS (ZERO HORIZONTAL SCROLL) */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              borderBottom: '2px solid var(--line)',
              paddingBottom: 2,
              flexWrap: 'wrap'
            }}
          >
            {/* Primary Inventory Sub-Tabs */}
            {primarySection === 'inventory' && (
              <>
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('grid')}
                  style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Layers size={14} />
                  <span>Multi-Stage Categorization Grid</span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('reservations')}
                  style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <BookmarkCheck size={14} />
                  <span>Active Blood Holds ({reservations.filter((r) => r.status === 'ACTIVE').length})</span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'bags' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('bags')}
                  style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Droplet size={14} />
                  <span>Bag-Level Unit Registry ({bags.length})</span>
                </button>
              </>
            )}

            {/* Lab Operations Sub-Tabs */}
            {primarySection === 'lab' && (
              <>
                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'serology' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('serology')}
                  style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <FlaskConical size={14} />
                  <span>
                    Mandatory Serology Screening ({bags.filter((b) => b.stage === 'QUARANTINE').length} Pending)
                  </span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'emptyBags' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('emptyBags')}
                  style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Package size={14} />
                  <span>Empty Collection Bag Stocks ({emptyBags.length} Types)</span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${activeTab === 'testKits' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('testKits')}
                  style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <FileCheck size={14} />
                  <span>Serology Test Kits & Reagents ({testKits.length})</span>
                </button>
              </>
            )}

            {/* Audit & Logs Sub-Tabs */}
            {primarySection === 'audit' && (
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('logs')}
                style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Clock size={14} />
                <span>Dispense & Restock Audit History</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: MULTI-STAGE CATEGORIZATION GRID (REQ 7) */}
        {activeTab === 'grid' && (
          <div className="table-container">
            <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                  Multi-Stage Blood Categorization Grid
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  Comprehensive breakdown: Fresh (≤14 days), Old (&gt;14 days), Unscreened (Quarantine), Whole Blood (W/B) vs PRBC
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsReserveOpen(true)}
              >
                <BookmarkCheck size={14} style={{ color: '#b45309' }} />
                <span>Reserve Units</span>
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Fresh (&le;14d)</th>
                  <th>Old (&gt;14d)</th>
                  <th>Unscreened (Quarantine)</th>
                  <th>Whole Blood (W/B)</th>
                  <th>Packed Cells (PRBC)</th>
                  <th>Reserved Units</th>
                  <th>Available (Unreserved)</th>
                  <th>Total Units</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {categorizationGrid.map((row) => {
                  const theme = GROUP_CARD_THEMES[row.group] || {};
                  return (
                    <tr key={row.group}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: theme.border || '#cbd5e1'
                            }}
                          />
                          <strong style={{ fontSize: 16, color: theme.text || 'inherit' }}>
                            {row.group}
                          </strong>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#15803d' }}>{row.freshUnits}</strong> units
                      </td>
                      <td>
                        <span style={{ color: row.oldUnits > 2 ? '#b45309' : 'inherit' }}>
                          {row.oldUnits} units
                        </span>
                      </td>
                      <td>
                        {row.unscreenedUnits > 0 ? (
                          <span className="badge badge-amber" style={{ fontSize: 11 }}>
                            {row.unscreenedUnits} in quarantine
                          </span>
                        ) : (
                          <span style={{ color: 'var(--ink-soft)', fontSize: 12 }}>0 pending</span>
                        )}
                      </td>
                      <td>{row.wbUnits} unit(s)</td>
                      <td>{row.prbcUnits} unit(s)</td>
                      <td>
                        <strong style={{ color: row.reservedUnits > 0 ? '#b45309' : 'inherit' }}>
                          {row.reservedUnits}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ fontSize: 15, color: '#16a34a' }}>
                          {row.availableUnits}
                        </strong>
                      </td>
                      <td>
                        <strong>{row.totalUnits}</strong>
                      </td>
                      <td>
                        <span className={`badge ${row.isLow ? 'badge-red' : 'badge-green'}`}>
                          {row.isLow ? 'Near Low' : 'Optimal'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => {
                              setReserveForm((prev) => ({ ...prev, bloodGroup: row.group }));
                              setIsReserveOpen(true);
                            }}
                          >
                            Reserve
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => {
                              setDispenseForm((prev) => ({ ...prev, group: row.group }));
                              setIsDispenseOpen(true);
                            }}
                          >
                            Dispense
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ACTIVE RESERVATIONS (REQ 6) */}
        {activeTab === 'reservations' && (
          <div className="table-container">
            <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                  Active & Historical Blood Unit Reservations (Req 6)
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  Units are locked for intended patients. Available stock automatically excludes reserved holds.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsReserveOpen(true)}
              >
                <BookmarkCheck size={14} />
                <span>New Reservation</span>
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Group</th>
                  <th>Units</th>
                  <th>Patient Name</th>
                  <th>Reserved By</th>
                  <th>Hold Period</th>
                  <th>Expires / Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 30, color: 'var(--ink-soft)' }}>
                      No blood reservations created yet. Click "New Reservation" to reserve units.
                    </td>
                  </tr>
                ) : (
                  reservations.map((rsv) => {
                    const isExpired = new Date(rsv.expiresAt) < new Date();
                    const isActive = rsv.status === 'ACTIVE' && !isExpired;

                    return (
                      <tr key={rsv.id}>
                        <td>
                          <strong style={{ color: '#b45309' }}>{rsv.reservationCode}</strong>
                        </td>
                        <td>
                          <strong style={{ fontSize: 15 }}>{rsv.bloodGroup}</strong>
                        </td>
                        <td>
                          <strong>{rsv.units}</strong> unit(s)
                        </td>
                        <td>
                          <strong>{rsv.patientName}</strong>
                        </td>
                        <td style={{ fontSize: 12 }}>{rsv.reservedBy}</td>
                        <td>{rsv.holdHours} hrs</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span
                              className={`badge ${
                                rsv.status === 'FULFILLED'
                                  ? 'badge-green'
                                  : rsv.status === 'RELEASED'
                                  ? 'badge-secondary'
                                  : isActive
                                  ? 'badge-amber'
                                  : 'badge-red'
                              }`}
                            >
                              {rsv.status === 'ACTIVE' && isExpired ? 'EXPIRED' : rsv.status}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                              Exp: {formatDate(rsv.expiresAt)}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, maxWidth: 180 }}>{rsv.notes || '—'}</td>
                        <td>
                          {isActive ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{ padding: '3px 8px', fontSize: 11, background: '#16a34a', borderColor: '#16a34a' }}
                                onClick={() => handleFulfillReservation(rsv.id, rsv.reservationCode, rsv.patientName)}
                                title="Dispense blood for this patient"
                              >
                                <CheckCircle2 size={12} />
                                <span>Fulfill</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '3px 8px', fontSize: 11, color: '#dc2626' }}
                                onClick={() => handleReleaseReservation(rsv.id, rsv.reservationCode)}
                                title="Cancel hold and return to available pool"
                              >
                                <XCircle size={12} />
                                <span>Release</span>
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Closed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: BAG-LEVEL UNIT REGISTRY (REQ 7) */}
        {activeTab === 'bags' && (
          <div className="table-container">
            <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                  Bag-Level Unit Registry & Expiry Tracking (Req 7)
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  Individual serialized blood bags with donor traceability, storage conditions, and expiry countdowns
                </p>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                  value={bagFilterGroup}
                  onChange={(e) => setBagFilterGroup(e.target.value)}
                >
                  <option value="ALL">All Blood Groups</option>
                  {stocks.map((s) => (
                    <option key={s.group} value={s.group}>
                      {s.group}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                  value={bagFilterStage}
                  onChange={(e) => setBagFilterStage(e.target.value)}
                >
                  <option value="ALL">All Stages</option>
                  <option value="SCREENED_AVAILABLE">Screened Available</option>
                  <option value="QUARANTINE">Quarantine (Unscreened)</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="EXPIRING_SOON">Expiring Soon (≤10d)</option>
                </select>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsRegisterBagOpen(true)}
                >
                  <Plus size={14} />
                  <span>Register Bag</span>
                </button>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Bag ID</th>
                  <th>Group</th>
                  <th>Component</th>
                  <th>Donor Info</th>
                  <th>Collected On</th>
                  <th>Expiry Countdown</th>
                  <th>Stage</th>
                  <th>Serology Status</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBags.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: 30, color: 'var(--ink-soft)' }}>
                      No blood bags match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredBags.map((bag) => {
                    const daysRemaining = Math.ceil((new Date(bag.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = daysRemaining <= 10;
                    const isQuarantine = bag.stage === 'QUARANTINE';

                    return (
                      <tr key={bag.id}>
                        <td>
                          <strong style={{ color: 'var(--navy)' }}>{bag.bagId}</strong>
                          <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{bag.bagType}</div>
                        </td>
                        <td>
                          <strong style={{ fontSize: 15 }}>{bag.bloodGroup}</strong>
                        </td>
                        <td style={{ fontSize: 12 }}>{bag.componentType}</td>
                        <td style={{ fontSize: 12 }}>
                          <div>{bag.donorName || 'Voluntary Donor'}</div>
                          <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{bag.donorCode}</span>
                        </td>
                        <td>{formatDate(bag.collectionDate)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ color: isExpiringSoon ? '#dc2626' : '#15803d' }}>
                              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                            </strong>
                            <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                              {formatDate(bag.expiryDate)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              bag.stage === 'SCREENED_AVAILABLE'
                                ? 'badge-green'
                                : bag.stage === 'QUARANTINE'
                                ? 'badge-amber'
                                : bag.stage === 'RESERVED'
                                ? 'badge-blue'
                                : 'badge-red'
                            }`}
                          >
                            {bag.stage.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              bag.serologyStatus === 'CLEARED'
                                ? 'badge-green'
                                : bag.serologyStatus === 'PENDING'
                                ? 'badge-amber'
                                : 'badge-red'
                            }`}
                          >
                            {bag.serologyStatus}
                          </span>
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{bag.location}</td>
                        <td>
                          {isQuarantine ? (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11, color: '#9333ea', borderColor: '#d8b4fe' }}
                              onClick={() => openScreeningModal(bag)}
                            >
                              <FlaskConical size={12} />
                              <span>Screen</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✓ Cleared</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: MANDATORY SEROLOGY SCREENING PIPELINE (REQ 7) */}
        {activeTab === 'serology' && (
          <div>
            <div
              style={{
                background: '#faf5ff',
                border: '1.5px solid #d8b4fe',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 20
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <FlaskConical size={28} style={{ color: '#9333ea' }} />
                <div>
                  <h4 style={{ color: '#6b21a8', fontSize: 15, fontWeight: 700 }}>
                    Mandatory 4-Assay Serology Clearance Pipeline
                  </h4>
                  <p style={{ fontSize: 13, color: '#581c87', marginTop: 2 }}>
                    Every collected blood bag is quarantined until verified non-reactive for <strong>HIV 1&2, Hepatitis C (HCV), Hepatitis B (HBsAg), and Syphilis (VDRL)</strong>.
                    Submitting clearance automatically deducts reagents from the active kit inventory.
                  </p>
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-toolbar">
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                  Quarantine Bags Awaiting Serology Clearance
                </h3>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bag ID</th>
                    <th>Group</th>
                    <th>Component</th>
                    <th>Donor</th>
                    <th>Collection Date</th>
                    <th>HIV 1/2</th>
                    <th>HCV</th>
                    <th>HBsAg</th>
                    <th>VDRL</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bags.filter((b) => b.stage === 'QUARANTINE' || b.serologyStatus === 'PENDING').length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: 30, color: '#15803d' }}>
                        ✓ All collected bags have been screened and cleared! No pending units in Quarantine.
                      </td>
                    </tr>
                  ) : (
                    bags
                      .filter((b) => b.stage === 'QUARANTINE' || b.serologyStatus === 'PENDING')
                      .map((bag) => (
                        <tr key={bag.id}>
                          <td>
                            <strong>{bag.bagId}</strong>
                          </td>
                          <td>
                            <strong style={{ fontSize: 15 }}>{bag.bloodGroup}</strong>
                          </td>
                          <td>{bag.componentType}</td>
                          <td>{bag.donorName || bag.donorCode}</td>
                          <td>{formatDate(bag.collectionDate)}</td>
                          <td>
                            <span className="badge badge-amber">{bag.hivResult}</span>
                          </td>
                          <td>
                            <span className="badge badge-amber">{bag.hcvResult}</span>
                          </td>
                          <td>
                            <span className="badge badge-amber">{bag.hbsagResult}</span>
                          </td>
                          <td>
                            <span className="badge badge-amber">{bag.vdrlResult}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ background: '#9333ea', borderColor: '#9333ea' }}
                              onClick={() => openScreeningModal(bag)}
                            >
                              <FileCheck size={13} />
                              <span>Screen Unit</span>
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

        {/* TAB 5: EMPTY BAG STOCK TRACKER (REQ 7) */}
        {activeTab === 'emptyBags' && (
          <div className="table-container">
            <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                  Empty Collection Bag Stock Tracker (Req 7)
                </h3>
                <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  Tracking consumable Single (S/B), Triple (3D), and Quadruple (4/D) blood bags with minimum threshold triggers
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
                padding: 16
              }}
            >
              {emptyBags.map((bag) => {
                const isLow = bag.currentStock <= bag.minThreshold;

                return (
                  <div
                    key={bag.id}
                    className="card"
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      border: isLow ? '2px solid #ef4444' : '1px solid var(--line)',
                      background: isLow ? '#fff5f5' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ fontSize: 18, color: 'var(--navy)', fontWeight: 700 }}>{bag.bagType}</h4>
                      <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14 }}>
                      {bag.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Current Inventory:</span>
                      <strong style={{ fontSize: 16, color: isLow ? '#dc2626' : 'var(--navy)' }}>
                        {bag.currentStock} bags
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Min Threshold:</span>
                      <span>{bag.minThreshold} bags</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Anticoagulant Solution:</span>
                      <span style={{ fontWeight: 600 }}>{bag.anticoagulant}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 14 }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Unit Acquisition Cost:</span>
                      <span>₹{bag.unitCost?.toFixed(2) || '0.00'}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        setSelectedEmptyBag(bag);
                        setEmptyBagRestockQty(25);
                        setIsRestockEmptyBagOpen(true);
                      }}
                    >
                      <Plus size={14} />
                      <span>Restock Bags (+25)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: SEROLOGY TEST KITS & REAGENTS (REQ 7) */}
        {activeTab === 'testKits' && (
          <div>
            <div className="table-container" style={{ marginBottom: 24 }}>
              <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                    Serology Test Kit Inventory & Reagent Lots (Req 7)
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                    Reagent kits for HIV, HCV, HBsAg, and VDRL/Syphilis clearance screening
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 16,
                  padding: 16
                }}
              >
                {testKits.map((kit) => {
                  const pct = Math.round((kit.testsRemaining / (kit.totalTestsKit || 100)) * 100);
                  const isLow = kit.testsRemaining <= kit.minThreshold;

                  return (
                    <div
                      key={kit.id}
                      className="card"
                      style={{
                        padding: 18,
                        borderRadius: 12,
                        border: isLow ? '2px solid #ef4444' : '1px solid var(--line)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <h4 style={{ fontSize: 15, color: 'var(--navy)', fontWeight: 700, lineHeight: 1.3 }}>
                          {kit.assayName}
                        </h4>
                        <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`}>
                          {isLow ? 'Low Kit' : 'Optimal'}
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
                        Manufacturer: <strong>{kit.manufacturer}</strong>
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
                        Lot Number: <strong style={{ color: 'var(--navy)' }}>{kit.lotNumber}</strong> · Exp:{' '}
                        {formatDate(kit.expiryDate)}
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span>Tests Remaining:</span>
                          <strong>
                            {kit.testsRemaining} / {kit.totalTestsKit} ({pct}%)
                          </strong>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: 6,
                            background: '#e2e8f0',
                            borderRadius: 3,
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: isLow ? '#ef4444' : '#16a34a',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => {
                          setSelectedTestKit(kit);
                          setKitRestockForm({
                            addedTests: 50,
                            lotNumber: kit.lotNumber,
                            expiryDate: kit.expiryDate ? new Date(kit.expiryDate).toISOString().slice(0, 10) : ''
                          });
                          setIsRestockTestKitOpen(true);
                        }}
                      >
                        <Plus size={14} />
                        <span>Restock Kit Tests</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DISPENSE & RESTOCK AUDIT HISTORY */}
        {activeTab === 'logs' && (
          <div className="table-container">
            <div className="table-toolbar">
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                Blood Bank Dispense & Restock Audit History
              </h3>
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
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 30 }}>
                      No transaction logs yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <strong style={{ color: 'var(--red-700)' }}>{log.logCode}</strong>
                      </td>
                      <td>
                        <strong style={{ fontSize: 15 }}>{log.bloodGroup}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            log.type === 'Issued'
                              ? 'badge-red'
                              : log.type === 'Reserved'
                              ? 'badge-amber'
                              : log.type === 'Released'
                              ? 'badge-secondary'
                              : 'badge-green'
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td>
                        <strong>{log.units}</strong> unit(s)
                      </td>
                      <td>{formatDate(log.date)}</td>
                      <td>{log.performedBy}</td>
                      <td style={{ fontSize: 13, color: 'var(--ink)' }}>{log.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL 1: RESERVE BLOOD STOCK (REQ 6) */}
        <Modal
          isOpen={isReserveOpen}
          onClose={() => setIsReserveOpen(false)}
          title="Reserve Blood Units (Patient Hold)"
        >
          <form onSubmit={handleReserveSubmit}>
            <div style={{ marginBottom: 16, padding: 12, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
              <p style={{ fontSize: 13, color: '#92400e' }}>
                Reserving blood ensures units remain on hold exclusively for this patient. Reserved units are automatically subtracted from available public and clinical stock.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select
                className="form-control"
                value={reserveForm.bloodGroup}
                onChange={(e) => setReserveForm({ ...reserveForm, bloodGroup: e.target.value })}
              >
                {stocks.map((s) => (
                  <option key={s.group} value={s.group}>
                    {s.group} (Available unreserved: {s.availableUnits} units)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Units to Reserve *</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={reserveForm.units}
                onChange={(e) => setReserveForm({ ...reserveForm, units: parseInt(e.target.value, 10) || 1 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quick Select Existing Patient</label>
              <select
                className="form-control"
                value={reserveForm.patientId}
                onChange={handleReservePatientSelect}
              >
                <option value="">-- Choose from Active Patients or Enter Custom Below --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode} · Blood: {p.bloodGroup || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Patient Name & Procedure Details *</label>
              <input
                type="text"
                className="form-control"
                value={reserveForm.patientName}
                onChange={(e) => setReserveForm({ ...reserveForm, patientName: e.target.value })}
                placeholder="e.g. R. Vigneshwar (Daycare Transfusion)"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hold Duration *</label>
              <select
                className="form-control"
                value={reserveForm.holdHours}
                onChange={(e) => setReserveForm({ ...reserveForm, holdHours: parseInt(e.target.value, 10) })}
              >
                <option value={12}>12 Hours (Emergency Surgery Hold)</option>
                <option value={24}>24 Hours (Standard Daycare Transfusion)</option>
                <option value={48}>48 Hours (Thalassemia Scheduled Exchange)</option>
                <option value={72}>72 Hours (Extended Inpatient Reservation)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Indication / Notes</label>
              <textarea
                className="form-control"
                rows="2"
                value={reserveForm.notes}
                onChange={(e) => setReserveForm({ ...reserveForm, notes: e.target.value })}
                placeholder="Clinical reason, scheduled appointment date, physician remarks..."
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsReserveOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: '#b45309', borderColor: '#b45309' }}
                disabled={submitting}
              >
                <BookmarkCheck size={14} />
                <span>{submitting ? 'Reserving...' : 'Confirm Blood Hold'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 2: REGISTER BLOOD BAG (REQ 7) */}
        <Modal
          isOpen={isRegisterBagOpen}
          onClose={() => setIsRegisterBagOpen(false)}
          title="Register Donor Blood Bag (Quarantine)"
        >
          <form onSubmit={handleRegisterBag}>
            <div style={{ marginBottom: 16, padding: 12, background: '#faf5ff', borderRadius: 8, border: '1px solid #d8b4fe' }}>
              <p style={{ fontSize: 13, color: '#6b21a8' }}>
                All collected donor bags are initially placed in <strong>Quarantine</strong>. They can only be released to transfusion stock after passing the mandatory 4-assay serology panel.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Blood Group *</label>
                <select
                  className="form-control"
                  value={bagForm.bloodGroup}
                  onChange={(e) => setBagForm({ ...bagForm, bloodGroup: e.target.value })}
                >
                  {stocks.map((s) => (
                    <option key={s.group} value={s.group}>
                      {s.group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bag Serial / Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={bagForm.bagId}
                  onChange={(e) => setBagForm({ ...bagForm, bagId: e.target.value })}
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Component Type *</label>
                <select
                  className="form-control"
                  value={bagForm.componentType}
                  onChange={(e) => setBagForm({ ...bagForm, componentType: e.target.value })}
                >
                  <option value="Packed Red Cells (PRBC)">Packed Red Cells (PRBC)</option>
                  <option value="Whole Blood (W/B)">Whole Blood (W/B)</option>
                  <option value="Platelet Concentrate (RDP)">Platelet Concentrate (RDP)</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bag Collection Type *</label>
                <select
                  className="form-control"
                  value={bagForm.bagType}
                  onChange={(e) => setBagForm({ ...bagForm, bagType: e.target.value })}
                >
                  <option value="Triple (3D)">Triple (3D - 450ml SAGM)</option>
                  <option value="Single (S/B)">Single (S/B - 350ml CPDA-1)</option>
                  <option value="Quadruple (4/D)">Quadruple (4/D - Leukodepleted)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Donor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={bagForm.donorName}
                  onChange={(e) => setBagForm({ ...bagForm, donorName: e.target.value })}
                  placeholder="Voluntary donor name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Donor ID / Aadhaar Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={bagForm.donorCode}
                  onChange={(e) => setBagForm({ ...bagForm, donorCode: e.target.value })}
                  placeholder="e.g. DNR-8891"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Collection Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={bagForm.collectionDate}
                  onChange={(e) => setBagForm({ ...bagForm, collectionDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Storage Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={bagForm.location}
                  onChange={(e) => setBagForm({ ...bagForm, location: e.target.value })}
                  placeholder="Quarantine Chamber Q-01"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRegisterBagOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Plus size={14} />
                <span>{submitting ? 'Registering...' : 'Register to Quarantine'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 3: MANDATORY SEROLOGY SCREENING (REQ 7) */}
        <Modal
          isOpen={isScreenModalOpen}
          onClose={() => {
            setIsScreenModalOpen(false);
            setScreeningTargetBag(null);
          }}
          title={`Mandatory Serology Screening: ${screeningTargetBag?.bagId || ''}`}
        >
          <form onSubmit={handleScreenSubmit}>
            <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Unit: <strong>{screeningTargetBag?.bagId}</strong></span>
                <span>Group: <strong style={{ color: 'var(--red-700)' }}>{screeningTargetBag?.bloodGroup}</strong></span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                Component: {screeningTargetBag?.componentType} · Collected: {formatDate(screeningTargetBag?.collectionDate)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">HIV 1 & 2 Assay *</label>
                <select
                  className="form-control"
                  value={screenForm.hivResult}
                  onChange={(e) => setScreenForm({ ...screenForm, hivResult: e.target.value })}
                >
                  <option value="NON_REACTIVE">NON-REACTIVE (Negative / Pass)</option>
                  <option value="REACTIVE">REACTIVE (Positive / Fail)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hepatitis C (HCV) *</label>
                <select
                  className="form-control"
                  value={screenForm.hcvResult}
                  onChange={(e) => setScreenForm({ ...screenForm, hcvResult: e.target.value })}
                >
                  <option value="NON_REACTIVE">NON-REACTIVE (Negative / Pass)</option>
                  <option value="REACTIVE">REACTIVE (Positive / Fail)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">HBsAg Surface Antigen *</label>
                <select
                  className="form-control"
                  value={screenForm.hbsagResult}
                  onChange={(e) => setScreenForm({ ...screenForm, hbsagResult: e.target.value })}
                >
                  <option value="NON_REACTIVE">NON-REACTIVE (Negative / Pass)</option>
                  <option value="REACTIVE">REACTIVE (Positive / Fail)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Syphilis / VDRL *</label>
                <select
                  className="form-control"
                  value={screenForm.vdrlResult}
                  onChange={(e) => setScreenForm({ ...screenForm, vdrlResult: e.target.value })}
                >
                  <option value="NON_REACTIVE">NON-REACTIVE (Negative / Pass)</option>
                  <option value="REACTIVE">REACTIVE (Positive / Fail)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Testing Pathologist / Officer *</label>
              <input
                type="text"
                className="form-control"
                value={screenForm.screenedBy}
                onChange={(e) => setScreenForm({ ...screenForm, screenedBy: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Laboratory Remarks / Test Batch</label>
              <input
                type="text"
                className="form-control"
                value={screenForm.notes}
                onChange={(e) => setScreenForm({ ...screenForm, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsScreenModalOpen(false);
                  setScreeningTargetBag(null);
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: '#9333ea', borderColor: '#9333ea' }}
                disabled={submitting}
              >
                <CheckCircle2 size={14} />
                <span>{submitting ? 'Validating...' : 'Authorize Serology Clearance'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 4: RESTOCK EMPTY BAGS (REQ 7) */}
        <Modal
          isOpen={isRestockEmptyBagOpen}
          onClose={() => setIsRestockEmptyBagOpen(false)}
          title={`Restock Empty Bags: ${selectedEmptyBag?.bagType || ''}`}
        >
          <form onSubmit={handleRestockEmptyBag}>
            <div className="form-group">
              <label className="form-label">Quantity to Add (Bags) *</label>
              <input
                type="number"
                min="1"
                max="500"
                className="form-control"
                value={emptyBagRestockQty}
                onChange={(e) => setEmptyBagRestockQty(parseInt(e.target.value, 10) || 0)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRestockEmptyBagOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <span>{submitting ? 'Updating...' : 'Add Stock'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 5: RESTOCK TEST KITS (REQ 7) */}
        <Modal
          isOpen={isRestockTestKitOpen}
          onClose={() => setIsRestockTestKitOpen(false)}
          title={`Restock Tests: ${selectedTestKit?.assayName || ''}`}
        >
          <form onSubmit={handleRestockTestKit}>
            <div className="form-group">
              <label className="form-label">Number of Tests to Add *</label>
              <input
                type="number"
                min="1"
                max="1000"
                className="form-control"
                value={kitRestockForm.addedTests}
                onChange={(e) =>
                  setKitRestockForm({ ...kitRestockForm, addedTests: parseInt(e.target.value, 10) || 0 })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kit Lot Number</label>
              <input
                type="text"
                className="form-control"
                value={kitRestockForm.lotNumber}
                onChange={(e) => setKitRestockForm({ ...kitRestockForm, lotNumber: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRestockTestKitOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <span>{submitting ? 'Restocking...' : 'Add Tests'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 6: QUICK LOAD STOCK */}
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
                {stocks.map((s) => (
                  <option key={s.group} value={s.group}>
                    {s.group}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Units to Add *</label>
              <input
                type="number"
                min="1"
                max="50"
                className="form-control"
                value={loadForm.units}
                onChange={(e) => setLoadForm({ ...loadForm, units: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Source / Blood Center Details</label>
              <input
                type="text"
                className="form-control"
                value={loadForm.source}
                onChange={(e) => setLoadForm({ ...loadForm, source: e.target.value })}
                placeholder="District Blood Center Khammam"
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsLoadOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <ArrowUpRight size={14} />
                <span>{submitting ? 'Loading...' : 'Add to Stock'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL 7: QUICK DISPENSE BLOOD */}
        <Modal
          isOpen={isDispenseOpen}
          onClose={() => setIsDispenseOpen(false)}
          title="Immediate Blood Transfusion Dispense"
        >
          <form onSubmit={handleDispense}>
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select
                className="form-control"
                value={dispenseForm.group}
                onChange={(e) => setDispenseForm({ ...dispenseForm, group: e.target.value })}
              >
                {stocks.map((s) => (
                  <option key={s.group} value={s.group}>
                    {s.group} (Available: {s.availableUnits} units)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Units to Dispense *</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={dispenseForm.units}
                onChange={(e) => setDispenseForm({ ...dispenseForm, units: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Patient</label>
              <select
                className="form-control"
                value={dispenseForm.patientId}
                onChange={(e) => setDispenseForm({ ...dispenseForm, patientId: e.target.value })}
              >
                <option value="">General Daycare Transfusion</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode} · Blood: {p.bloodGroup || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Indication / Notes</label>
              <input
                type="text"
                className="form-control"
                value={dispenseForm.notes}
                onChange={(e) => setDispenseForm({ ...dispenseForm, notes: e.target.value })}
                placeholder="Daycare Hematology Transfusion"
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
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
                style={{ background: 'var(--red-700)', borderColor: 'var(--red-700)' }}
                disabled={submitting}
              >
                <ArrowDownLeft size={14} />
                <span>{submitting ? 'Dispensing...' : 'Confirm Issuance'}</span>
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
