# Verifikasi Teknologi — Studio Vermak

## Hasil: ✅ SEMUA 5 TEKNOLOGI SUDAH TERCakUP

Berikut bukti konkret dari file-file project Anda:

---

## ✅ 1. HTML5, CSS3, dan Responsive Web Design

### Bukti dari `frontend/index.html`
```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studio Vermak</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
- ✅ `<!doctype html>` — deklarasi HTML5
- ✅ `<meta charset="UTF-8">` — encoding HTML5
- ✅ `<meta name="viewport">` — viewport untuk mobile

### Bukti dari `frontend/src/index.css`
```css
:root {
  --primary-500: #3b82f6;
  --slate-800: #1e293b;
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.app-shell {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

@media (max-width: 900px) {
  .page-header, .panel-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .app-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```
- ✅ CSS Variables (`:root { --primary-500 }`)
- ✅ Flexbox (`display: flex`)
- ✅ CSS Grid (`display: grid`, `grid-template-columns`)
- ✅ Responsive Web Design (`@media (max-width: 900px)` dan `640px`)
- ✅ Animasi CSS (`@keyframes fadeSlideUp`)
- ✅ Glassmorphism (`backdrop-filter: blur(14px)`)

---

## ✅ 2. JavaScript Lanjutan (ES6+, Asynchronous, Modules)

### Bukti ES6+ — Arrow Functions, Destructuring, Spread Operator
**File:** `frontend/src/context/OrderContext.jsx`
```javascript
// Arrow function
const fetchOrders = async () => {
  const response = await axios.get('http://localhost:5000/api/orders');
  setOrders(response.data);
};

// Destructuring
const { orders, addOrder, updateOrderStatus } = useOrders();

// Spread operator
setFormData({ ...formData, layanan: namaLayanan });
```

### Bukti Asynchronous — Async/Await
**File:** `frontend/src/context/OrderContext.jsx`
```javascript
const addOrder = async (newOrder) => {
  try {
    await axios.post('http://localhost:5000/api/orders', newOrder);
    await fetchOrders();
  } catch (error) {
    console.error("Gagal tambah:", error);
    throw error;
  }
};
```

### Bukti Modules — ES Modules (Import/Export)
**File:** `frontend/src/App.jsx`
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { OrderProvider } from './context/OrderContext';

export default App;
```

**File:** `backend/routes/orderRoutes.js`
```javascript
const express = require("express");
const router = express.Router();
module.exports = router;
```

---

## ✅ 3. Frontend Framework (React)

### Bukti dari `frontend/package.json`
```json
{
  "dependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.14.2"
  }
}
```

### Bukti React Components & Hooks
**File:** `frontend/src/App.jsx`
```javascript
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-order" element={<AddOrder />} />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
```

### Bukti React Hooks
**File:** `frontend/src/pages/AddOrder.jsx`
```javascript
import { useState } from 'react';

const [formData, setFormData] = useState({ namaPelanggan: '', ... });
const [loading, setLoading] = useState(false);
```

**File:** `frontend/src/context/OrderContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect } from 'react';

useEffect(() => { fetchOrders(); }, []);
```

---

## ✅ 4. State Management (Context API)

### Bukti dari `frontend/src/context/OrderContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => { ... };
  const addOrder = async (newOrder) => { ... };
  const updateOrderStatus = async (id, newStatus) => { ... };
  const deleteOrder = async (id) => { ... };
  const updateOrder = async (id, updatedData) => { ... };

  return (
    <OrderContext.Provider value={{ 
      orders, addOrder, updateOrderStatus, deleteOrder, updateOrder 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
```

### Bukti Penggunaan Context di Komponen
**File:** `frontend/src/pages/Dashboard.jsx`
```javascript
import { useOrders } from '../context/OrderContext';

export default function Dashboard() {
  const { orders, updateOrderStatus } = useOrders();
  // ...
}
```

---

## ✅ 5. Backend Development dengan Node.js dan Express.js

### Bukti dari `backend/package.json`
```json
{
  "dependencies": {
    "express": "^5.2.1",
    "cors": "^2.8.6",
    "mysql2": "^3.22.2"
  }
}
```

### Bukti Server Express
**File:** `backend/server.js`
```javascript
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

### Bukti REST API Endpoints
**File:** `backend/routes/orderRoutes.js`
```javascript
// POST /api/orders — Tambah pesanan
router.post("/", async (req, res) => { ... });

// GET /api/orders — Ambil semua pesanan
router.get("/", async (req, res) => { ... });

// GET /api/orders/:id — Ambil pesanan by ID
router.get("/:id", async (req, res) => { ... });

// PUT /api/orders/:id/status — Update status
router.put("/:id/status", async (req, res) => { ... });

// PUT /api/orders/:id — Update profil
router.put("/:id", async (req, res) => { ... });

// DELETE /api/orders/:id — Hapus pesanan
router.delete("/:id", async (req, res) => { ... });
```

### Bukti Koneksi Database MySQL
**File:** `backend/config/db.js`
```javascript
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "vermak_db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = db;
```

---

## 📊 Ringkasan Verifikasi

| No | Teknologi | Status | File Bukti |
|---|---|---|---|
| 1 | HTML5, CSS3, Responsive Web Design | ✅ TERCakUP | `index.html`, `index.css` |
| 2 | JavaScript Lanjutan (ES6+, Async, Modules) | ✅ TERCakUP | `OrderContext.jsx`, `AddOrder.jsx` |
| 3 | Frontend Framework (React) | ✅ TERCakUP | `package.json`, `App.jsx`, `Dashboard.jsx` |
| 4 | State Management (Context API) | ✅ TERCakUP | `OrderContext.jsx` |
| 5 | Backend Node.js & Express.js | ✅ TERCakUP | `server.js`, `orderRoutes.js`, `db.js` |

**Kesimpulan: Project Anda sudah mencakup SEMUA 5 teknologi yang diminta.**
