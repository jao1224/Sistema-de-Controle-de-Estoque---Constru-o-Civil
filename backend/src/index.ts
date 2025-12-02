// Servidor principal da aplicação

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { appConfig } from './config';
import { db } from './database';
import routes from './routes';
import { errorHandler } from './middleware';

const app = express();
const PORT = appConfig.server.port;

// Middleware
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar charset UTF-8 para todas as respostas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Servir arquivos estáticos do frontend
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Rotas da API
app.use('/api', routes);

// Middleware de erro
app.use(errorHandler);

// Serve frontend SPA (catch-all)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).json({ message: 'API rodando. Frontend não encontrado (build).' });
});

// Iniciar servidor
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
