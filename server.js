const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// In-memory fallback if file system is read-only (e.g., Vercel serverless)
let memoryOrders = [];

function readOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const fileData = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      if (Array.isArray(fileData)) {
        // Merge with memory orders (dedup by id)
        const map = new Map();
        [...fileData, ...memoryOrders].forEach(o => { if (o && o.id) map.set(o.id, o); });
        return Array.from(map.values());
      }
    }
  } catch (err) {
    console.warn('Notice: Using memory orders store:', err.message);
  }
  return memoryOrders;
}

function writeOrders(orders) {
  memoryOrders = orders;
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.warn('Notice: Could not write orders to disk (running on read-only/ephemeral storage):', err.message);
  }
}

app.use(express.json());

// Serve static assets with caching headers for images
app.use(express.static(__dirname, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));

// API: List products (mirrors data.js)
app.get('/api/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'data.js'));
});

// API: Create order
app.post('/api/orders', (req, res) => {
  try {
    const orders = readOrders();
    const order = {
      id: 'LP' + Date.now(),
      ...req.body,
      status: 'placed',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    writeOrders(orders);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process order', details: err.message });
  }
});

// API: Fetch one order by id
app.get('/api/orders/:id', (req, res) => {
  const order = readOrders().find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// API: List all orders
app.get('/api/orders', (req, res) => {
  res.json(readOrders());
});

// Health check endpoint for container platforms (Render, Railway, etc.)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`La Perlyn store running at http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
