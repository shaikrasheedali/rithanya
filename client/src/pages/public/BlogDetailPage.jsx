import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';
import { apiRequest } from '../../utils/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
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
    return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Loading article...</div>;
  }

  if (!blog) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <Link to="/insights" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Health Insights</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page" style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 880 }}>
        <Link to="/insights" className="btn btn-secondary btn-sm" style={{ marginBottom: 24 }}>
          <ArrowLeft size={16} />
          <span>Back to Health Insights</span>
        </Link>

        <span className="badge badge-red" style={{ marginBottom: 12 }}>{blog.category}</span>
        <h1 style={{ fontSize: 38, lineHeight: 1.25, marginBottom: 16 }}>{blog.title}</h1>

        <div style={{ display: 'flex', gap: 20, color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 30, borderBottom: '1px solid var(--line)', paddingBottom: 16 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={16} style={{ color: 'var(--red-700)' }} />
            {blog.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={16} style={{ color: 'var(--red-700)' }} />
            {blog.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} style={{ color: 'var(--red-700)' }} />
            {blog.readTime}
          </span>
        </div>

        <div className="article-cover-wrap" style={{ aspectRatio: '16/9', borderRadius: 16, marginBottom: 32 }}>
          <img src={blog.coverImage} alt={blog.title} />
        </div>

        <div
          className="article-body-content"
          style={{ lineHeight: 1.85, fontSize: 16, color: '#2b2729' }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag size={14} /> Tags:
            </span>
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="badge badge-blue">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
