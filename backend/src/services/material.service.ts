// Serviço de lógica de negócio para materiais

import { db } from '../database';

export class MaterialService {
  async getAllMaterials() {
    return await db.getAllMaterials();
  }

  async createMaterial(data: {
    name: string;
    unit?: string;
    min_stock?: number;
    max_stock?: number | null;
    price?: number;
    description?: string;
  }) {
    return await db.createMaterial(
      data.name,
      data.unit || 'un',
      data.min_stock || 0,
      data.max_stock || null,
      data.price || 0,
      data.description || ''
    );
  }

  async updateMaterial(
    id: number,
    data: {
      name: string;
      unit: string;
      min_stock: number;
      max_stock: number | null;
      price: number;
      description: string;
    }
  ) {
    return await db.updateMaterial(
      id,
      data.name,
      data.unit,
      data.min_stock,
      data.max_stock,
      data.price,
      data.description
    );
  }

  async updateMaterialLimits(
    id: number,
    min_stock: number,
    max_stock: number | null
  ) {
    return await db.updateMaterialLimits(id, min_stock, max_stock);
  }

  async deleteMaterial(id: number) {
    return await db.deleteMaterial(id);
  }
}

export const materialService = new MaterialService();
