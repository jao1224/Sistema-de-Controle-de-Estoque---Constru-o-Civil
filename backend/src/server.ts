import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { db } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Routes
app.post('/api/stock', async (req: Request, res: Response) => {
  try {
    const { material, quantity, location, message, unit, type } = req.body;

    if (!material || quantity === undefined) {
      return res
        .status(400)
        .json({ error: 'material e quantity são obrigatórios' });
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty)) {
      return res.status(400).json({ error: 'quantity deve ser número' });
    }

    const id = await db.insertRecord(material, qty, location, message, unit, type);
    res.status(201).json({ ok: true, id });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/records', async (req: Request, res: Response) => {
  try {
    const records = await db.getAllRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/summary', async (req: Request, res: Response) => {
  try {
    const summary = await db.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/dashboard-data', async (req: Request, res: Response) => {
  try {
    const data = await db.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Serve frontend SPA
import fs from 'fs';

app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // Se não existir build do frontend, informar que API está funcionando
  return res.status(200).json({ message: 'API rodando. Frontend não encontrado (build).' });
});

// Start server
async function start() {
  try {
    await db.init();
    console.log('✓ Banco de dados inicializado');

    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

start();
