import React from 'react';

const FormInput = ({ label, type = 'text', value, onChange, required, options, placeholder, rows }) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ focusRingColor: '#5F9EA0' }}
          required={required}
        >
          <option value="">Select {label}</option>
          {options?.map((opt, idx) => (
            <option key={idx} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows || 3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ focusRingColor: '#5F9EA0' }}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ focusRingColor: '#5F9EA0' }}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormInput;
