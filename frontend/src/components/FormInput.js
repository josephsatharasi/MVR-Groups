import React from 'react';

const FormInput = ({ label, type = 'text', value, onChange, required, options, placeholder, rows }) => {
  // Handle mobile number input validation
  const handleMobileChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '').slice(0, 10);
    const newEvent = { ...e, target: { ...e.target, value: numericValue } };
    onChange(newEvent);
  };

  // Handle Aadhar number input validation (12 digits with space after every 4)
  const handleAadharChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '').slice(0, 12);
    // Format: XXXX XXXX XXXX
    let formatted = numericValue.match(/.{1,4}/g)?.join(' ') || numericValue;
    const newEvent = { ...e, target: { ...e.target, value: formatted } };
    onChange(newEvent);
  };

  // Handle PAN number input validation (5 letters + 4 numbers + 1 letter)
  const handlePANChange = (e) => {
    let inputValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    let formatted = '';
    
    for (let i = 0; i < inputValue.length; i++) {
      if (i < 5) {
        // First 5 characters: only letters
        if (/[A-Z]/.test(inputValue[i])) formatted += inputValue[i];
      } else if (i < 9) {
        // Next 4 characters: only numbers
        if (/[0-9]/.test(inputValue[i])) formatted += inputValue[i];
      } else {
        // Last character: only letter
        if (/[A-Z]/.test(inputValue[i])) formatted += inputValue[i];
      }
    }
    
    const newEvent = { ...e, target: { ...e.target, value: formatted } };
    onChange(newEvent);
  };

  // Check field types
  const isMobileField = label && (label.toLowerCase().includes('mobile') || label.toLowerCase().includes('whatsapp') || (type === 'tel' && placeholder && placeholder.toLowerCase().includes('mobile')));
  const isAadharField = label && label.toLowerCase().includes('aadhar');
  const isPANField = label && label.toLowerCase().includes('pan');

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
          type={isMobileField || isAadharField ? 'tel' : isPANField ? 'text' : type}
          value={value}
          onChange={isMobileField ? handleMobileChange : isAadharField ? handleAadharChange : isPANField ? handlePANChange : onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
          style={{ focusRingColor: '#5F9EA0' }}
          placeholder={placeholder}
          required={required}
          maxLength={isMobileField ? "10" : isAadharField ? "14" : isPANField ? "10" : undefined}
          pattern={isMobileField ? "[0-9]{10}" : isAadharField ? "[0-9]{4} [0-9]{4} [0-9]{4}" : isPANField ? "[A-Z]{5}[0-9]{4}[A-Z]{1}" : undefined}
        />
      )}
      {isMobileField && <p className="text-xs text-gray-500 mt-1">Enter 10 digit number (numbers only)</p>}
      {isAadharField && <p className="text-xs text-gray-500 mt-1">Enter 12 digit Aadhar (format: XXXX XXXX XXXX)</p>}
      {isPANField && <p className="text-xs text-gray-500 mt-1">Enter PAN (format: ABCDE1234F)</p>}
    </div>
  );
};

export default FormInput;
