// Serviço de lógica de negócio para estoque

import { db } from '../database';

export class StockService {
  async createRecord(data: {
    material: string;
    quantity: number;
    type: string;
    userId?: number | null;
    location?: string;
    message?: string;
    unit?: string;
    price?: number;
  }) {
    return await db.insertRecord(
      data.material,
      Math.abs(data.quantity),
      data.type,
      data.userId || null,
      data.location,
      data.message,
      data.unit,
      data.price
    );
  }

  async getAllRecords() {
    return await db.getAllRecords();
  }

  async getSummary() {
    return await db.getSummary();
  }

  async getDashboardData() {
    return await db.getDashboardData();
  }
}

export const stockService = new StockService();
