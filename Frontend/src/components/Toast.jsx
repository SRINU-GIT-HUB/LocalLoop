import { useState, useEffect } from 'react';

let addToastFn = null;

export const toast = {
  success: (msg) => addToastFn?.({ type: 'success', msg }),
  error: (msg) => addToastFn?.({ type: 'error', msg }),
  info: (msg) => addToastFn?.({ type: 'info', msg }),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = ({ type, msg }) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, type, msg }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    return () => { addToastFn = null; };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
};
