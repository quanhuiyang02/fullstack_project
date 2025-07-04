# 🧩 Fullstack Virtual Pet Game (React + PHP + Python)

這是一個分層式全端專案，採用 Vite + React 前端，PHP 與 Python 為後端服務，結合 MySQL 儲存遊戲狀態與互動紀錄，打造虛擬寵物互動介面！

---

## 📁 專案結構

```
fullstack_project/
├── frontend/          # Vite + React 前端（獨立 package.json）
├── backend/           # 後端 API（PHP / Python）
│   ├── public/        # PHP 路由處理（index.php）
│   └── python/        # Flask API 或背景任務（app.py）
├── database/          # SQL 腳本 / 初始資料

```

---

## 🚀 如何啟動專案

### 🔧 前置作業

```bash
cd frontend
npm install
```

### ▶️ 啟動開發環境

| 服務         | 埠口         |
|--------------|--------------|
| React + Vite | `localhost:5173` |
| PHP API      | `localhost:8000` |
| Python Flask | `localhost:8001` |

---

## ⚙️ Proxy 設定（vite.config.ts）

```ts
server: {
  proxy: {
    '/pet': 'http://localhost:8000',
    '/inventory': 'http://localhost:8000',
    '/api': 'http://localhost:8000'
  }
}
```

React 端可以直接呼叫：
```ts
fetch("/pet/feed?user_id=1")
fetch("/api/pet_status")
```

---

## 📖 常見指令（於 `frontend/`）

```bash
npm run dev          # 啟動前端
```

---

## 🛠️ 環境需求

| 工具     | 版本建議     |
|----------|--------------|
| Node.js  | 18+          |
| npm      | 9+           |
| PHP      | 8+          |
| Python   | 3.8+（含 flask）|
| MySQL    | 任意版本，可用 XAMPP / MAMP 啟動 |

---

## ✅ 功能涵蓋

- 寵物狀態資料查詢 / 餵食 / 互動 / 清潔
- PHP RESTful 路由設計 + API 回傳 JSON
- Python 後端查詢資料 / 排程任務準備
- 前端呼叫 `/pet/`、`/inventory/`、`/api/` 等整合路由

---

## 💡 作者群

本專案由以下四位成員協作開發與維護 👥：

- [Ailey](mailto:ailey@example.com) — 前端架構、互動設計、美術整合 🐾 
- [成員二]（職責：如後端 API / PHP 控制器設計） 🐾 
- [成員三]（職責：如 Python 排程、資料管理） 🐾 
- [成員四]（職責：如 UI/UX 視覺企劃、音效資源） 🐾 

強調模組化開發、跨平台啟動流程、簡約畫風與資料邏輯兼容的遊戲互動設計 ✨