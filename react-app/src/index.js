// react-app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // ← 확실히 확장자 확인!
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
