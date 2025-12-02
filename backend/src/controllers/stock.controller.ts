// Controller para operações de estoque

import { Request, Response } from 'express';
import { stockService } from '../services';

export class StockController {
  async createRecord(req: Request, res: Response) {
    try {
      const { material, quantity, location, message, unit, type, price } = req.body;

      if (!material || quantity === undefined) {
        return res.status(400).json({ error: 'material e quantity são obrigatórios' });
      }

      const qty = parseFloat(quantity);
      if (isNaN(qty)) {
        return res.status(400).json({ error: 'quantity deve ser número' });
      }

      const result = await stockService.createRecord({
        material,
        quantity: qty,
        type: type || 'entrada',
        location,
        message,
        unit,
        price: price ? parseFloat(price) : 0
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

  async getAllRecords(req: Request, res: Response) {
    try {
      const records = await stockService.getAllRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await stockService.getSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }

  async getDashboardData(req: Request, res: Response) {
    try {
      const data = await stockService.getDashboardData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  }
}

export const stockController = new StockController();
