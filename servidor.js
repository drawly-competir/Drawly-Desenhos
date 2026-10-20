const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwlpK3SSGdEH4PJFJPuVZHm3cCpLY6MJdaMwOjpMWnbpXuBBUsSYy4wCe78bESNkYU/exec";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/inscrever', async (req, res) => {
  console.log("📥 Recebi:", req.body);
  try {
    const r = await fetch(URL_PLANILHA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    console.log("📊 Planilha:", await r.text());
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
