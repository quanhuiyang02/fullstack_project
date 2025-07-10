// src/main.tsx   （若是 JS 就改 .jsx，型別註解拿掉）
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import App from './App';          // ← 這就是你的虛擬寵物遊戲
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 首頁 → LoginPage */}
        <Route path="/" element={<LoginPage />} />

        {/* /game → 你的原本遊戲元件 App */}
        <Route path="/game" element={<App />} />

        {/* 其他路徑 → 導回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
