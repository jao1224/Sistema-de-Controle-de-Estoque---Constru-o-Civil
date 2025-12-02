// Rotas de estoque

import { Router } from 'express';
import { stockController } from '../controllers';

const router = Router();

// POST /api/stock - Criar novo registro
router.post('/', (req, res) => stockController.createRecord(req, res));

// GET /api/records - Listar todos os registros
router.get('/records', (req, res) => stockController.getAllRecords(req, res));

// GET /api/summary - Resumo do estoque
router.get('/summary', (req, res) => stockController.getSummary(req, res));

// GET /api/materiais - Alias para summary
router.get('/materiais', (req, res) => stockController.getSummary(req, res));

// GET /api/dashboard-data - Dados do dashboard
router.get('/dashboard-data', (req, res) => stockController.getDashboardData(req, res));

export default router;
