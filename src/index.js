// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 💡 FIX: Uncomment these lines to import and initialize i18n
import './i18n';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 💡 FIX: The i18n instance is already initialized globally by importing it.
        You don't need the I18nextProvider. The use() call in i18n.js
        handles the connection to react-i18next. */}
    <App />
  </React.StrictMode>
);