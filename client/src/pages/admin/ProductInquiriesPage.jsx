import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import Modal from '../../components/common/Modal';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate, formatDateTime, formatINR } from '../../utils/formatters';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending Payment/Review', bg: '#fef3c7', text: '#92400e', icon: Clock },
  CONFIRMED: { label: 'Order Confirmed', bg: '#e0f2fe', text: '#0369a1', icon: CheckCircle },
  DISPATCHED: { label: 'Dispatched / In Transit', bg: '#f3e8ff', text: '#6b21a8', icon: Truck },
  DELIVERED: { label: 'Delivered Successfully', bg: '#dcfce7', text: '#15803d', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', bg: '#fee2e2', text: '#991b1b', icon: XCircle }
};

export default function ProductInquiriesPage() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await apiRequest('/inquiries');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await apiRequest(`/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: newStatus })
      });
      addToast(`Order status updated to ${newStatus}`, 'success');
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this order record?')) return;
    try {
      await apiRequest(`/inquiries/${id}`, { method: 'DELETE' });
      addToast('Order deleted successfully', 'success');
      if (selectedOrder && selectedOrder.id === id) setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Failed to delete order', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      statusFilter === 'ALL' ||
      (o.orderStatus || 'PENDING').toUpperCase() === statusFilter.toUpperCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q)) ||
      (o.orderCode && o.orderCode.toLowerCase().includes(q)) ||
      (o.packageName && o.packageName.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => (o.orderStatus || 'PENDING') === 'PENDING').length,
    confirmed: orders.filter((o) => o.orderStatus === 'CONFIRMED').length,
    dispatched: orders.filter((o) => o.orderStatus === 'DISPATCHED').length,
    delivered: orders.filter((o) => o.orderStatus === 'DELIVERED').length
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Healthcare Product Orders & Fulfillment"
        subtitle="Manage E-Commerce Orders, Shipping Addresses, Delivery Status & Customer Details"
      />

      <div className="admin-content">
        {/* KPI Counter Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 24
          }}
        >
          <div style={{ background: 'var(--canvas)', padding: 16, borderRadius: 10, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>Total Orders</span>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{stats.total}</div>
          </div>
          <div style={{ background: 'var(--canvas)', padding: 16, borderRadius: 10, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>Pending Review</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#92400e', marginTop: 4 }}>{stats.pending}</div>
          </div>
          <div style={{ background: 'var(--canvas)', padding: 16, borderRadius: 10, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 600 }}>Confirmed</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0369a1', marginTop: 4 }}>{stats.confirmed}</div>
          </div>
          <div style={{ background: 'var(--canvas)', padding: 16, borderRadius: 10, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, color: '#6b21a8', fontWeight: 600 }}>Dispatched</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#6b21a8', marginTop: 4 }}>{stats.dispatched}</div>
          </div>
          <div style={{ background: 'var(--canvas)', padding: 16, borderRadius: 10, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>Delivered</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{stats.delivered}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['ALL', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                type="button"
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s)}
                style={{ textTransform: 'capitalize' }}
              >
                {s === 'ALL' ? 'All Orders' : s.toLowerCase()}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0, width: '100%' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-soft)'
              }}
            />
            <input
              type="text"
              placeholder="Search by order #, patient name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: 34, fontSize: 13 }}
            />
          </div>
        </div>

        {/* Table of Orders */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Code</th>
                <th>Date & Time</th>
                <th>Customer Name</th>
                <th>Contact</th>
                <th>Items Ordered</th>
                <th>Total (₹)</th>
                <th>Fulfillment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-soft)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const statusKey = (ord.orderStatus || 'PENDING').toUpperCase();
                  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.PENDING;
                  const itemsList = Array.isArray(ord.items) ? ord.items : [];
                  const itemCount = itemsList.reduce((acc, it) => acc + (it.quantity || 1), 0);

                  return (
                    <tr key={ord.id}>
                      <td>
                        <strong style={{ color: 'var(--red-700)', letterSpacing: '0.04em' }}>
                          {ord.orderCode || `ORD-${ord.id.slice(0, 6).toUpperCase()}`}
                        </strong>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{formatDate(ord.createdAt)}</div>
                        <small style={{ color: 'var(--ink-soft)' }}>
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </td>
                      <td>
                        <strong>{ord.name}</strong>
                        {ord.city && (
                          <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                            <MapPin size={11} style={{ display: 'inline', marginRight: 2 }} />
                            {ord.city}
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <Phone size={12} style={{ display: 'inline', marginRight: 4, color: 'var(--red-600)' }} />
                          <a href={`tel:${ord.phone}`} style={{ color: 'inherit', fontWeight: 600 }}>
                            {ord.phone}
                          </a>
                        </div>
                        {ord.email && (
                          <small style={{ color: 'var(--ink-soft)', display: 'block' }}>{ord.email}</small>
                        )}
                      </td>
                      <td>
                        {itemsList.length > 0 ? (
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>
                              {itemsList[0]?.name}
                              {itemsList.length > 1 ? ` + ${itemsList.length - 1} more` : ''}
                            </span>
                            <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>
                              {itemCount} total {itemCount === 1 ? 'unit' : 'units'}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 13 }}>{ord.packageName || 'Direct Inquiry'}</span>
                        )}
                      </td>
                      <td>
                        <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                          {formatINR(ord.totalAmount || 0)}
                        </strong>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{
                            fontSize: 12,
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: cfg.bg,
                            color: cfg.text,
                            fontWeight: 700,
                            border: `1px solid ${cfg.text}33`
                          }}
                          value={statusKey}
                          disabled={updatingId === ord.id}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        >
                          {Object.keys(STATUS_CONFIG).map((k) => (
                            <option key={k} value={k}>
                              {STATUS_CONFIG[k].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedOrder(ord)}
                            title="View Full Order Details"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#d32f2f' }}
                            onClick={() => handleDelete(ord.id)}
                            title="Delete Order"
                          >
                            <Trash2 size={13} />
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

        {/* ORDER DETAILS MODAL */}
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder?.orderCode || 'ORD'}`}
          size="lg"
        >
          {selectedOrder && (
            <div>
              {/* Header Details */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'var(--canvas-warm, #f8f9fa)',
                  borderRadius: 8,
                  marginBottom: 20
                }}
              >
                <div>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Placed on</span>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {formatDateTime(selectedOrder.createdAt)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Order Status</span>
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12,
                        background:
                          STATUS_CONFIG[(selectedOrder.orderStatus || 'PENDING').toUpperCase()]?.bg || '#fef3c7',
                        color:
                          STATUS_CONFIG[(selectedOrder.orderStatus || 'PENDING').toUpperCase()]?.text || '#92400e'
                      }}
                    >
                      {STATUS_CONFIG[(selectedOrder.orderStatus || 'PENDING').toUpperCase()]?.label ||
                        selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Grid: Customer Info & Shipping Address */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16, marginBottom: 20 }}>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    border: '1px solid var(--line)',
                    background: 'var(--canvas)'
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--ink)' }}>Customer Information</h4>
                  <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>Name: </strong>
                      {selectedOrder.name}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>Phone: </strong>
                      <a href={`tel:${selectedOrder.phone}`} style={{ color: 'var(--red-700)', fontWeight: 600 }}>
                        {selectedOrder.phone}
                      </a>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>Email: </strong>
                      {selectedOrder.email || 'None provided'}
                    </div>
                    {selectedOrder.message && (
                      <div style={{ marginTop: 8, padding: 8, background: '#f8f9fa', borderRadius: 6, fontSize: 12 }}>
                        <strong>Patient Note:</strong> {selectedOrder.message}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    border: '1px solid var(--line)',
                    background: 'var(--canvas)'
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--ink)' }}>Delivery Address</h4>
                  <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>Street Address: </strong>
                      {selectedOrder.address || 'Direct Hospital Pickup / Khammam Local'}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>City: </strong>
                      {selectedOrder.city || 'Khammam'}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>Pincode: </strong>
                      {selectedOrder.pincode || '507001'}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink-soft)' }}>State: </strong>
                      Telangana
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>Products & Items Ordered</h4>
              <div className="table-container" style={{ marginBottom: 20 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style={{ textAlign: 'right' }}>Unit Price</th>
                      <th style={{ textAlign: 'center' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{item.name}</strong>
                          </td>
                          <td style={{ textAlign: 'right' }}>{formatINR(item.price || 0)}</td>
                          <td style={{ textAlign: 'center' }}>{item.quantity || 1}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>
                            {formatINR((item.price || 0) * (item.quantity || 1))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <strong>{selectedOrder.packageName || 'Direct Healthcare Package'}</strong>
                        </td>
                        <td style={{ textAlign: 'right' }}>{formatINR(selectedOrder.totalAmount || 0)}</td>
                        <td style={{ textAlign: 'center' }}>1</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          {formatINR(selectedOrder.totalAmount || 0)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>
                        Grand Total:
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 15, color: 'var(--red-700)' }}>
                        {formatINR(selectedOrder.totalAmount || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Status Updater inside modal */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'var(--canvas-warm, #f8f9fa)',
                  borderRadius: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Update Status:</span>
                  <select
                    className="form-control"
                    style={{ width: 'auto', fontWeight: 700 }}
                    value={(selectedOrder.orderStatus || 'PENDING').toUpperCase()}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  >
                    {Object.keys(STATUS_CONFIG).map((k) => (
                      <option key={k} value={k}>
                        {STATUS_CONFIG[k].label}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
