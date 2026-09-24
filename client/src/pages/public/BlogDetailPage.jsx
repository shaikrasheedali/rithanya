import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import useDynamicTranslation from '../../utils/dynamicTranslator';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t, loc, locItem } = useDynamicTranslation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        const res = await apiRequest(`/blogs/${slug}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, [slug]);

  if (loading) {
    return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>{t('common.loading', 'Loading article...')}</div>;
  }

  if (!blog) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>{loc('Article Not Found')}</h2>
        <Link to="/insights" className="btn btn-primary" style={{ marginTop: 20 }}>{loc('Back to Health Insights')}</Link>
      </div>
    );
  }

  const currentBlog = locItem(blog);

  return (
    <div className="blog-detail-page" style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 1140 }}>
        <Link to="/insights" className="btn btn-secondary btn-sm" style={{ marginBottom: 24 }}>
          <ArrowLeft size={16} />
          <span>{loc('Back to Health Insights')}</span>
        </Link>

        <span className="badge badge-red" style={{ marginBottom: 12 }}>{currentBlog.category}</span>
        <h1 style={{ fontSize: 38, lineHeight: 1.25, marginBottom: 16 }}>{currentBlog.title}</h1>

        <div style={{ display: 'flex', gap: 20, color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 30, borderBottom: '1px solid var(--line)', paddingBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={16} style={{ color: 'var(--red-700)' }} />
            {loc(currentBlog.author)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={16} style={{ color: 'var(--red-700)' }} />
            {currentBlog.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} style={{ color: 'var(--red-700)' }} />
            {loc(currentBlog.readTime)}
          </span>
        </div>

        <div className="article-cover-wrap" style={{ aspectRatio: '21/9', maxHeight: 480, borderRadius: 16, marginBottom: 32, overflow: 'hidden' }}>
          <img src={currentBlog.coverImage} alt={currentBlog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div
          className="article-body-content ql-editor"
          style={{ lineHeight: 1.85, fontSize: 16.5, color: '#2b2729' }}
          dangerouslySetInnerHTML={{ __html: currentBlog.content }}
        />

        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag size={14} /> {loc('Tags')}:
            </span>
            {currentBlog.tags.map((tag, idx) => (
              <span key={idx} className="badge badge-blue">{loc(tag)}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
