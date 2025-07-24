import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
    <input {...props} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
  </div>
);
