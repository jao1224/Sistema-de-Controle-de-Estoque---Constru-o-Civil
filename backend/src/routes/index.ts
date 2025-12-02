// Configuração central de rotas

import { Router } from 'express';
import stockRoutes from './stock.routes';
import materialRoutes from './material.routes';

const router = Router();

// Rotas de estoque
router.use('/stock', stockRoutes);
router.use('/records', stockRoutes);
router.use('/summary', stockRoutes);
router.use('/materiais', stockRoutes);
router.use('/dashboard-data', stockRoutes);

// Rotas de materiais
router.use('/materials', materialRoutes);

export default router;
