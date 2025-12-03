// Configuração central de rotas

import { Router } from 'express';
import stockRoutes from './stock.routes';
import materialRoutes from './material.routes';

const router = Router();

// Rotas de estoque (todas começam com /api/)
router.use('/', stockRoutes);

// Rotas de materiais (/api/materials)
router.use('/materials', materialRoutes);

export default router;
