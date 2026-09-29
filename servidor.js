const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwdJGaYr9b_yO0krEHCb7NLjWDey5LvLXaF8y9KhTGI5kTVv7y3W8s0G4sZGaQj3kE/exec";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

const dataFile = path.join(__dirname, 'inscritos.json');
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]');

app.post('/api/inscrever', async (req, res) => {
  const { nome, insta, zap, selo } = req.body;
  if (!nome ||!insta) return res.status(400).json({ error: "Falta nome/insta" });

  const novo = {
    id: Date.now(),
    data: new Date().toLocaleString('pt-BR'),
    nome, insta, zap: zap || "",
    selo: selo? "SIM" : "NAO"
  };

  const dados = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const existente = dados.findIndex(d => d.insta.toLowerCase() === insta.toLowerCase());
  if(existente >= 0) dados[existente] = novo; else dados.push(novo);
  fs.writeFileSync(dataFile, JSON.stringify(dados, null, 2));

  try {
    const fetch = require('node-fetch');
    await fetch(URL_PLANILHA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo)
    });
    console.log("→ Planilha OK:", insta);
  } catch(e){ console.log("Planilha offline:", e.message) }

  console.log(`✅ ${nome} - ${insta} - Selo:${novo.selo}`);
  res.json({ success: true });
});

app.get('/api/inscritos', (req,res) => {
  res.json(JSON.parse(fs.readFileSync(dataFile, 'utf8')));
});

app.listen(PORT, () => console.log(`🚀 RODANDO EM http://localhost:${PORT}`));