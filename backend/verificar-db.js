const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.sqlite3');
const db = new sqlite3.Database(DB_PATH);

console.log('=== VERIFICAÇÃO DO BANCO DE DADOS ===\n');

// Listar todos os registros
db.all('SELECT * FROM stock_records ORDER BY id', (err, rows) => {
  if (err) {
    console.error('Erro ao ler registros:', err);
    return;
  }

  console.log('📋 TODOS OS REGISTROS:');
  console.log('─'.repeat(120));
  console.log('ID | Material      | Qtd      | Unidade | Tipo    | Local           | Mensagem        | Data/Hora');
  console.log('─'.repeat(120));
  
  rows.forEach(r => {
    console.log(
      `${String(r.id).padEnd(2)} | ` +
      `${String(r.material).padEnd(13)} | ` +
      `${String(r.quantity).padStart(8)} | ` +
      `${String(r.unit || 'un').padEnd(7)} | ` +
      `${String(r.type || 'entrada').padEnd(7)} | ` +
      `${String(r.location || '-').padEnd(15)} | ` +
      `${String(r.message || '-').padEnd(15)} | ` +
      `${r.timestamp}`
    );
  });

  console.log('─'.repeat(120));
  console.log(`\nTotal de registros: ${rows.length}\n`);

  // Calcular resumo por material
  db.all('SELECT material, SUM(quantity) as total FROM stock_records GROUP BY material ORDER BY material', (err, summary) => {
    if (err) {
      console.error('Erro ao calcular resumo:', err);
      db.close();
      return;
    }

    console.log('📊 RESUMO DO ESTOQUE (Soma das Quantidades):');
    console.log('─'.repeat(50));
    console.log('Material      | Quantidade Total');
    console.log('─'.repeat(50));
    
    summary.forEach(s => {
      console.log(`${String(s.material).padEnd(13)} | ${s.total}`);
    });
    
    console.log('─'.repeat(50));
    console.log('\n✅ Verificação concluída!\n');
    
    db.close();
  });
});
