import React from 'react';

export default function RithanyaLogo({
  size = 44,
  className = '',
  style = {},
  title = 'Rithanya Hospital Logo'
}) {
  const widthStyle = typeof size === 'number' ? `${size}px` : size;
  const heightStyle = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src="/logo.jpeg"
      alt={title}
      className={`rithanya-brand-logo ${className}`.trim()}
      style={{
        width: widthStyle,
        height: heightStyle,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
        borderRadius: '8px',
        ...style
      }}
      loading="eager"
    />
  );
}
