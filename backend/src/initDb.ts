import { db } from './db';

async function initDatabase() {
  try {
    console.log('Inicializando banco de dados...');
    await db.init();
    console.log('✓ Banco de dados inicializado com sucesso!');
    
    // Adicionar alguns dados de exemplo
    console.log('Adicionando dados de exemplo...');
    await db.insertRecord('Cimento', 50, 'Depósito A', 'Compra inicial', 'saco', 'entrada');
    await db.insertRecord('Areia', 10, 'Depósito B', 'Fornecedor XYZ', 'm³', 'entrada');
    await db.insertRecord('Tijolo', 5000, 'Depósito A', 'Lote 001', 'un', 'entrada');
    await db.insertRecord('Ferro', 200, 'Depósito C', '8mm', 'kg', 'entrada');
    await db.insertRecord('Cimento', -10, 'Obra 1', 'Uso na fundação', 'saco', 'saida');
    
    console.log('✓ Dados de exemplo adicionados!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    process.exit(1);
  }
}

initDatabase();
