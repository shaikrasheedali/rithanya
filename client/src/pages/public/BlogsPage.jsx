import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, Tag } from 'lucide-react';
import { apiRequest } from '../../utils/api';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await apiRequest('/blogs');
        setBlogs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="blogs-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Clinical Education</span>
          <h1 className="section-title">Health Library & Clinical Insights</h1>
          <p className="section-subtitle">
            Evidence-backed articles by Dr. Narayana Murthy on practical diabetes management, thalassemia day-care protocols, and lifestyle longevity.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Loading articles...</div>
        ) : (
          <div className="grid-3">
            {blogs.map((blog) => (
              <article key={blog.id} className="card card-clickable" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-image-wrap">
                  <img src={blog.coverImage} alt={blog.title} />
                </div>
                <div style={{ padding: '20px 0 0', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="badge badge-red">{blog.category}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{blog.readTime}</span>
                  </div>

                  <h3 style={{ fontSize: 18, marginBottom: 10 }}>{blog.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20, flexGrow: 1 }}>{blog.summary}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{blog.author}</span>
                    <Link to={`/blogs/${blog.slug}`} className="btn btn-outline btn-sm">
                      <span>Read Article</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
