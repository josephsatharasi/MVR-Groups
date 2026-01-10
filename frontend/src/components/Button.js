import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled, icon: Icon }) => {
  const styles = {
    primary: { backgroundColor: '#2F4F4F', color: 'white' },
    secondary: { backgroundColor: '#5F9EA0', color: 'white' },
    danger: { backgroundColor: '#EF4444', color: 'white' },
    success: { backgroundColor: '#10B981', color: 'white' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50"
      style={styles[variant]}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
