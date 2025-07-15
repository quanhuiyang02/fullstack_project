//src/main.tsx
import React, { lazy, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// 使用 React.lazy 懶加載元件
const LoginPage = lazy(() => import('./components/LoginPage'));
const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/fullstack_project">
      <Suspense fallback={<div>載入中...</div>}>
        <Routes>
            {/* 首頁 → LoginPage */}
          <Route path="/" element={<LoginPage />} />

          {/* /game → 你的原本遊戲元件 App */}
          <Route path="/game" element={<App />} />

          {/* 其他路徑 → 導回首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
