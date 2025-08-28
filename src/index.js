import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Complete ResizeObserver error suppression - All possible solutions

// Solution 1: Global error event listener
window.addEventListener('error', e => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Solution 2: Unhandled rejection handler
window.addEventListener('unhandledrejection', e => {
  if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver loop')) {
    e.preventDefault();
  }
});

// Solution 3: Console error override
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop')) {
    return;
  }
  originalError.apply(console, args);
};

// Solution 4: ResizeObserver wrapper with debouncing and error handling
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    let timeout;
    const debouncedCallback = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        try {
          callback(...args);
        } catch (e) {
          if (e.message && e.message.includes('ResizeObserver loop')) {
            return;
          }
          throw e;
        }
      }, 16);
    };
    super(debouncedCallback);
  }
};

// Solution 5: Override window.onerror
const originalOnError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (message && message.includes('ResizeObserver loop')) {
    return true;
  }
  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);