import React from 'react';

/**
 * ModuleErrorBoundary - Catches runtime or API rendering crashes in specific modules
 * and displays a localized, elegant degradation card without breaking the rest of the application.
 */
export default class ModuleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ModuleErrorBoundary] Error caught in module ${this.props.moduleName || 'ERP'}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onRetry === 'function') {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const moduleName = this.props.moduleName || 'This Module';
      return (
        <div
          className="module-fallback-container"
          style={{
            padding: '40px 24px',
            maxWidth: 640,
            margin: '40px auto',
            background: 'var(--surface, #ffffff)',
            borderRadius: 16,
            border: '1px solid rgba(197, 14, 31, 0.15)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(197, 14, 31, 0.1)',
              color: '#c50e1f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              margin: '0 auto 16px'
            }}
          >
            ⚠️
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink, #1e293b)', marginBottom: 8 }}>
            {moduleName} Temporarily Unavailable
          </h3>
          <p style={{ fontSize: 14, color: 'var(--ink-light, #64748b)', lineHeight: 1.6, marginBottom: 24 }}>
            The system encountered a temporary schema or database desynchronization while loading {moduleName}.
            All clinical and patient data remains safely encrypted.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={this.handleRetry}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #c50e1f 0%, #991b1b 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Retry Connection
            </button>
            <a
              href="/admin/dashboard"
              className="btn btn-secondary"
              style={{
                background: 'var(--canvas, #f8fafc)',
                color: 'var(--ink, #1e293b)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '10px 22px',
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
