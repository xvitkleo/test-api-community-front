require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT || 3000;
app.use(cors({ origin: '*' }));
app.options('*', cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/1.0/test-cors', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/1.0', require('./app/routes'));

app.use((req, res) => {
  res.status(404).send({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Tu API es http://localhost:${PORT}/api/1.0`);
});
