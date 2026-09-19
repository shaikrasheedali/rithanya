import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Users,
  Stethoscope,
  BedDouble,
  Droplet,
  CalendarCheck,
  FileText,
  UserRoundCheck,
  Package,
  MessageSquare,
  Image,
  FolderOpen,
  UserCog,
  Briefcase,
  IndianRupee,
  ShieldAlert,
  Settings,
  LogOut
} from 'lucide-react';
import { getStoredUser, clearSession, hasPermission, isSuperAdmin } from '../../utils/auth';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearSession();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Clinical Operations',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, perm: 'dashboard' },
        { name: 'Patients EMR', path: '/admin/patients', icon: Users, perm: 'patients' },
        { name: 'Clinical Vitals', path: '/admin/clinical', icon: Stethoscope, perm: 'clinical' },
        { name: 'Daycare Admissions', path: '/admin/admissions', icon: BedDouble, perm: 'admissions' },
        { name: 'Blood Bank & Stock', path: '/admin/inventory', icon: Droplet, perm: 'inventory' },
        { name: 'Appointments', path: '/admin/appointments', icon: CalendarCheck, perm: 'appointments' }
      ]
    },
    {
      title: 'Content & Inquiries',
      items: [
        { name: 'Services CMS', path: '/admin/services', icon: FileText, perm: 'services' },
        { name: 'Health Blogs', path: '/admin/blogs', icon: FileText, perm: 'blogs' },
        { name: 'Specialist Doctors', path: '/admin/specialists', icon: UserRoundCheck, perm: 'specialists' },
        { name: 'Health Packages', path: '/admin/products', icon: Package, perm: 'products' },
        { name: 'Package Inquiries', path: '/admin/product-inquiries', icon: MessageSquare, perm: 'productInquiries' },
        { name: 'Photo Gallery', path: '/admin/gallery', icon: Image, perm: 'gallery' },
        { name: 'Media Library', path: '/admin/media', icon: FolderOpen, perm: 'media' }
      ]
    },
    {
      title: 'Administration & DPDP',
      items: [
        { name: 'Staff HR', path: '/admin/staff', icon: Briefcase, perm: 'staff' },
        { name: 'Credentials & RBAC', path: '/admin/credentials', icon: UserCog, perm: 'credentials' },
        { name: 'Finance & Expenses', path: '/admin/finance', icon: IndianRupee, perm: 'finance' },
        { name: 'DPDP Erasure Requests', path: '/admin/erasure-requests', icon: ShieldAlert, perm: 'erasure' },
        { name: 'System Settings', path: '/admin/settings', icon: Settings, perm: 'settings' }
      ]
    }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="brand-icon" style={{ width: 36, height: 36 }}>
          <Activity size={20} />
        </div>
        <div>
          <h2>Rithanya Hospital</h2>
          <span>ERP & Clinical Center</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group) => {
          // Filter items based on user permissions
          const accessibleItems = group.items.filter(
            (item) => !item.perm || hasPermission(user, item.perm) || isSuperAdmin(user)
          );

          if (accessibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              <div className="sidebar-section-title">{group.title}</div>
              {accessibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--red-700)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13
            }}
          >
            {user ? user.name[0] : 'U'}
          </div>
          <div>
            <div className="sidebar-user-name">{user ? user.name : 'Hospital Staff'}</div>
            <div className="sidebar-user-role">{user ? user.role : 'Staff'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="icon-btn"
          title="Sign Out"
          style={{ background: 'none', border: 'none', color: '#a8a0a5', cursor: 'pointer' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
