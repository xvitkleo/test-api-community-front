require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// CORS primero
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization']
}));
app.options('*', cors());

// Body parser y estáticos
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.get('/api/1.0/test-cors', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/1.0', require('./app/routes'));

// 404
app.use((req, res) => {
  res.status(404).send({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Tu API es http://localhost:${PORT}/api/1.0`);
});
