import sqlite3 from 'sqlite3';
import path from 'path';
import { promisify } from 'util';

// Usar /app/data em Docker, ou pasta local em desenvolvimento
const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/app/data/db.sqlite3'
  : path.join(__dirname, '..', 'db.sqlite3');

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco:', err);
        process.exit(1);
      }
    });
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          `CREATE TABLE IF NOT EXISTS stock_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            material TEXT NOT NULL,
            quantity REAL NOT NULL,
            unit TEXT DEFAULT 'un',
            type TEXT DEFAULT 'entrada',
            location TEXT,
            message TEXT,
            timestamp TEXT DEFAULT (datetime('now'))
          )`,
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });
  }

  async insertRecord(
    material: string,
    quantity: number,
    location?: string,
    message?: string,
    unit?: string,
    type?: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO stock_records (material, quantity, location, message, unit, type) VALUES (?, ?, ?, ?, ?, ?)',
        [material, quantity, location || null, message || null, unit || 'un', type || 'entrada'],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getAllRecords(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM stock_records ORDER BY timestamp DESC LIMIT 1000',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  async getSummary(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT material, SUM(quantity) as total FROM stock_records GROUP BY material',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  async getDashboardData(): Promise<{
    labels: string[];
    values: number[];
    latest: any[];
  }> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT material, SUM(quantity) as total FROM stock_records GROUP BY material',
        (err, summary) => {
          if (err) {
            reject(err);
            return;
          }

          this.db.all(
            'SELECT * FROM stock_records ORDER BY timestamp DESC LIMIT 20',
            (err, latest) => {
              if (err) {
                reject(err);
                return;
              }

              const labels = (summary || []).map((r: any) => r.material);
              const values = (summary || []).map((r: any) => parseFloat(r.total));
              resolve({
                labels,
                values,
                latest: latest || [],
              });
            }
          );
        }
      );
    });
  }

  close(): void {
    this.db.close();
  }
}

export const db = new Database();
