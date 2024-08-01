import React, { useEffect } from 'react';

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 m-3 right-4 bg-green-500 text-white p-4 rounded shadow-lg animate-bounce">
      {message}
      <button onClick={onClose} className="ml-4 text-white">×</button>
    </div>
  );
};

export default Toast;
