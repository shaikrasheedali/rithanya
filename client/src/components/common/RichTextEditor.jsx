import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { apiRequest } from '../../utils/api';
import { RotateCcw, RotateCw, Type, AlignLeft, Sparkles } from 'lucide-react';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Compose detailed clinical or medical content...',
  minHeight = 280,
  label,
  helperText,
  required = false
}) {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const isInternalChangeRef = useRef(false);

  const [stats, setStats] = useState({ words: 0, chars: 0 });

  useEffect(() => {
    if (!editorRef.current) return;

    // Custom toolbar configuration with rich formatting options
    const toolbarOptions = [
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ];

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: placeholder,
      modules: {
        toolbar: toolbarOptions,
        history: {
          delay: 1000,
          maxStack: 100,
          userOnly: true
        }
      }
    });

    quillInstanceRef.current = quill;

    // Attach custom image upload handler for direct file uploads to /api/media/upload
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      const fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', 'image/png, image/jpeg, image/webp, image/gif, image/svg+xml');
      fileInput.click();

      fileInput.onchange = async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await apiRequest('/media/upload', {
            method: 'POST',
            body: formData
          });

          if (res.data?.url) {
            const range = quill.getSelection(true) || { index: quill.getLength() };
            quill.insertEmbed(range.index, 'image', res.data.url);
            quill.setSelection(range.index + 1);
          }
        } catch (err) {
          console.error('Editor image upload failed:', err);
          alert('Image upload failed. Please verify the image file size is under 10MB.');
        }
      };
    });

    // Set initial content if provided
    if (value) {
      quill.root.innerHTML = value;
      updateStats(quill.getText());
    }

    // Handle text change
    quill.on('text-change', () => {
      isInternalChangeRef.current = true;
      const html = quill.root.innerHTML;
      const text = quill.getText();
      updateStats(text);
      if (onChange) {
        // Return empty string if only empty tag
        const cleanVal = html === '<p><br></p>' ? '' : html;
        onChange(cleanVal);
      }
      setTimeout(() => {
        isInternalChangeRef.current = false;
      }, 0);
    });

    return () => {
      quillInstanceRef.current = null;
    };
  }, []);

  // Synchronize external value updates
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (quill && !isInternalChangeRef.current) {
      const currentHtml = quill.root.innerHTML;
      if (value !== currentHtml && (value || currentHtml !== '<p><br></p>')) {
        quill.root.innerHTML = value || '';
        updateStats(quill.getText());
      }
    }
  }, [value]);

  const updateStats = (text) => {
    const trimmed = text.trim();
    const chars = trimmed.length;
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    setStats({ words, chars });
  };

  const handleUndo = () => {
    quillInstanceRef.current?.history?.undo();
  };

  const handleRedo = () => {
    quillInstanceRef.current?.history?.redo();
  };

  const handleClear = () => {
    if (window.confirm('Clear all content from the editor?')) {
      const quill = quillInstanceRef.current;
      if (quill) {
        quill.setText('');
        if (onChange) onChange('');
      }
    }
  };

  return (
    <div className="form-group wysiwyg-editor-wrapper">
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            {label} {required && <strong style={{ color: 'var(--red-600)' }}>*</strong>}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="editor-subtle-btn"
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              className="editor-subtle-btn"
              onClick={handleRedo}
              title="Redo (Ctrl+Y)"
            >
              <RotateCw size={13} />
            </button>
            <button
              type="button"
              className="editor-subtle-btn"
              onClick={handleClear}
              title="Clear Editor"
              style={{ color: 'var(--red-600)', marginLeft: 4 }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {helperText && (
        <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8, marginTop: 0 }}>
          {helperText}
        </p>
      )}

      <div className="wysiwyg-container" style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid var(--line)', background: '#fff' }}>
        <div ref={editorRef} style={{ minHeight: `${minHeight}px`, fontSize: '14.5px', lineHeight: '1.65' }} />
        
        {/* Editor Status Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 14px',
            background: 'var(--canvas)',
            borderTop: '1px solid var(--line)',
            fontSize: '11.5px',
            color: 'var(--ink-soft)',
            fontWeight: 500
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Words: <strong style={{ color: 'var(--ink)' }}>{stats.words}</strong></span>
            <span>Characters: <strong style={{ color: 'var(--ink)' }}>{stats.chars}</strong></span>
            <span>Est. Read: <strong style={{ color: 'var(--ink)' }}>{Math.max(1, Math.ceil(stats.words / 200))} min</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--emerald-600)' }}>
            <Sparkles size={12} />
            <span>WYSIWYG Rich Editor Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
