import React from 'react';

const Card = ({ title, children, actions }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>{title}</h2>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
