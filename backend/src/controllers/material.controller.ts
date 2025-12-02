// Controller para operações de materiais

import { Request, Response } from 'express';
import { materialService } from '../services';

export class MaterialController {
  async getAllMaterials(req: Request, res: Response) {
    try {
      const materials = await materialService.getAllMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }

  async createMaterial(req: Request, res: Response) {
    try {
      const { name, unit, min_stock, max_stock, price, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Nome do material é obrigatório' });
      }

      const result = await materialService.createMaterial({
        name,
        unit,
        min_stock: min_stock ? parseFloat(min_stock) : 0,
        max_stock: max_stock ? parseFloat(max_stock) : null,
        price: price ? parseFloat(price) : 0,
        description
      });

      if (result.success) {
        res.status(201).json({ ok: true, id: result.id });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }

  async updateMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, unit, min_stock, max_stock, price, description } = req.body;

      // Se vier só min_stock e max_stock, usa o método de atualizar limites
      if (!name && !unit && (min_stock !== undefined || max_stock !== undefined)) {
        const result = await materialService.updateMaterialLimits(
          parseInt(id),
          parseFloat(min_stock),
          max_stock ? parseFloat(max_stock) : null
        );

        if (result.success) {
          return res.json({ ok: true });
        } else {
          return res.status(400).json({ error: result.error });
        }
      }

      // Atualização completa do material
      if (!name || !unit) {
        return res.status(400).json({ error: 'Nome e unidade são obrigatórios' });
      }

      const result = await materialService.updateMaterial(parseInt(id), {
        name,
        unit,
        min_stock: min_stock ? parseFloat(min_stock) : 0,
        max_stock: max_stock ? parseFloat(max_stock) : null,
        price: price ? parseFloat(price) : 0,
        description: description || ''
      });

      if (result.success) {
        res.json({ ok: true });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }

  async deleteMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await materialService.deleteMaterial(parseInt(id));

      if (result.success) {
        res.json({ ok: true });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }
}

export const materialController = new MaterialController();
