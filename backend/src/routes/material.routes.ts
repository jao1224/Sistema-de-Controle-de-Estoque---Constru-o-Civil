// Rotas de materiais

import { Router } from 'express';
import { materialController } from '../controllers';

const router = Router();

// GET /api/materials - Listar todos os materiais
router.get('/', (req, res) => materialController.getAllMaterials(req, res));

// POST /api/materials - Criar novo material
router.post('/', (req, res) => materialController.createMaterial(req, res));

// PUT /api/materials/:id - Atualizar material
router.put('/:id', (req, res) => materialController.updateMaterial(req, res));

// DELETE /api/materials/:id - Excluir material
router.delete('/:id', (req, res) => materialController.deleteMaterial(req, res));

export default router;
