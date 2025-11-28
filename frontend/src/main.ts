import Chart from 'chart.js/auto';

interface DashboardData {
  labels: string[];
  values: number[];
  latest: StockRecord[];
}

interface StockRecord {
  id: number;
  material: string;
  quantity: number;
  unit?: string;
  type?: string;
  location: string;
  message: string;
  timestamp: string;
}

let chartInstance: Chart | null = null;

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard-data');
  if (!response.ok) {
    throw new Error('Falha ao carregar dados');
  }
  return response.json();
}

async function fetchRecords(): Promise<StockRecord[]> {
  const response = await fetch('/api/records');
  if (!response.ok) {
    throw new Error('Falha ao carregar registros');
  }
  return response.json();
}

function renderChart(labels: string[], values: number[]): void {
  console.log('renderChart chamado com:', { labels, values });
  
  const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas não encontrado!');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Contexto 2D não disponível!');
    return;
  }

  if (chartInstance) {
    console.log('Destruindo gráfico anterior');
    chartInstance.destroy();
  }

  console.log('Criando novo gráfico...');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Quantidade Total',
          data: values,
          backgroundColor: 'rgba(102, 126, 234, 0.7)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  console.log('Gráfico criado com sucesso!');
}

function renderTable(records: StockRecord[]): void {
  const container = document.getElementById('tableContainer');
  if (!container) return;

  if (records.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum registro disponível.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'table table-sm table-hover';
  table.innerHTML = `
    <thead class="table-light">
      <tr>
        <th>Data</th>
        <th>Material</th>
        <th>Tipo</th>
        <th>Quantidade</th>
        <th>Local</th>
        <th>Observações</th>
      </tr>
    </thead>
    <tbody>
      ${records
        .map(
          (r) => `
        <tr>
          <td>${new Date(r.timestamp).toLocaleString('pt-BR')}</td>
          <td><strong>${escapeHtml(r.material)}</strong></td>
          <td><span class="badge ${r.type === 'entrada' ? 'badge-entrada' : 'badge-saida'}">${r.type || 'entrada'}</span></td>
          <td>${r.quantity} ${r.unit || 'un'}</td>
          <td>${escapeHtml(r.location || '-')}</td>
          <td>${escapeHtml(r.message || '-')}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  `;

  container.innerHTML = '';
  container.appendChild(table);
}

function renderSummary(records: StockRecord[]): void {
  const container = document.getElementById('summaryContainer');
  if (!container) return;

  const summary: { [key: string]: number } = {};
  records.forEach((r) => {
    const qty = r.type === 'saida' ? -r.quantity : r.quantity;
    summary[r.material] = (summary[r.material] || 0) + qty;
  });

  const sortedMaterials = Object.entries(summary).sort((a, b) => b[1] - a[1]);

  if (sortedMaterials.length === 0) {
    container.innerHTML = '<p class="text-muted small">Nenhum material registrado.</p>';
    return;
  }

  container.innerHTML = `
    <div class="list-group list-group-flush">
      ${sortedMaterials
        .map(
          ([material, qty]) => `
        <div class="list-group-item d-flex justify-content-between align-items-center px-0">
          <span class="small">${escapeHtml(material)}</span>
          <span class="badge ${qty >= 0 ? 'bg-success' : 'bg-danger'} rounded-pill">${qty.toFixed(2)}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function updateStats(records: StockRecord[]): void {
  const materials = new Set(records.map((r) => r.material));
  const entradas = records.filter((r) => r.type === 'entrada').length;
  const saidas = records.filter((r) => r.type === 'saida').length;

  const totalMateriaisEl = document.getElementById('totalMateriais');
  const totalRegistrosEl = document.getElementById('totalRegistros');
  const totalEntradasEl = document.getElementById('totalEntradas');
  const totalSaidasEl = document.getElementById('totalSaidas');

  if (totalMateriaisEl) totalMateriaisEl.textContent = materials.size.toString();
  if (totalRegistrosEl) totalRegistrosEl.textContent = records.length.toString();
  if (totalEntradasEl) totalEntradasEl.textContent = entradas.toString();
  if (totalSaidasEl) totalSaidasEl.textContent = saidas.toString();
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function submitStock(event: Event): Promise<void> {
  event.preventDefault();

  const material = (document.getElementById('material') as HTMLSelectElement).value;
  const type = (document.getElementById('type') as HTMLSelectElement).value;
  const quantity = parseFloat((document.getElementById('quantity') as HTMLInputElement).value);
  const unit = (document.getElementById('unit') as HTMLSelectElement).value;
  const location = (document.getElementById('location') as HTMLInputElement).value;
  const message = (document.getElementById('message') as HTMLInputElement).value;

  try {
    const response = await fetch('/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        material,
        type,
        quantity: type === 'saida' ? -Math.abs(quantity) : Math.abs(quantity),
        unit,
        location,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao registrar');
    }

    (document.getElementById('stockForm') as HTMLFormElement).reset();
    await loadData();
    alert('Registro adicionado com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao adicionar registro. Verifique o console.');
  }
}

async function loadData(): Promise<void> {
  try {
    console.log('Carregando dados...');
    const [dashboardData, allRecords] = await Promise.all([
      fetchDashboardData(),
      fetchRecords(),
    ]);

    console.log('Dados recebidos:', { dashboardData, allRecords });
    
    renderChart(dashboardData.labels, dashboardData.values);
    renderTable(dashboardData.latest);
    renderSummary(allRecords);
    updateStats(allRecords);
    
    console.log('Dados carregados com sucesso!');
  } catch (error) {
    const container = document.getElementById('tableContainer');
    if (container) {
      container.innerHTML =
        '<p class="text-danger">Erro ao carregar dados. Verifique se o servidor está rodando.</p>';
    }
    console.error('Erro ao carregar dados:', error);
  }
}

async function init(): Promise<void> {
  const form = document.getElementById('stockForm');
  if (form) {
    form.addEventListener('submit', submitStock);
  }

  await loadData();
}

init();
