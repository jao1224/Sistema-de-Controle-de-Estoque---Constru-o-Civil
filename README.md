# 🏗️ Sistema de Controle de Estoque - Construção Civil

Sistema simples e funcional para controlar estoque de materiais de construção civil com dashboard interativo.

## 📋 Funcionalidades

- ✅ Registro de entradas e saídas de materiais
- ✅ Dashboard com gráficos em tempo real
- ✅ Estatísticas de estoque
- ✅ Histórico de movimentações
- ✅ Suporte a diferentes unidades (kg, m³, m², unidades, etc)
- ✅ Controle por localização
- ✅ Banco de dados SQLite

## 🚀 Como Usar

### 🐳 Opção 1: Docker (Recomendado)

**Mais fácil e rápido!**

```cmd
docker-start.bat
```

Ou manualmente:
```bash
docker-compose up -d --build
```

Acesse: http://localhost

📖 Guia completo: [DOCKER-GUIA.md](DOCKER-GUIA.md)

### 💻 Opção 2: Instalação Local

### Instalação Rápida (Windows)

**Opção 1 - Automática:**
```cmd
instalar.bat
```

**Opção 2 - Manual:**
```cmd
cd backend
npm install
npm run init-db

cd ..\frontend
npm install
```

⚠️ **Problemas com PowerShell?** Veja [INSTALACAO.md](INSTALACAO.md)

### Iniciar o Sistema

**Modo Desenvolvimento (Recomendado para testes):**
```cmd
iniciar-dev.bat
```
Ou manualmente em 2 terminais:
```cmd
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```
Acesse: http://localhost:5173

**Modo Produção:**
```cmd
iniciar-producao.bat
```
Ou manualmente:
```cmd
cd frontend
npm run build

cd ..\backend
npm run build
npm start
```
Acesse: http://localhost:5000

## 📡 API Endpoints

### POST /api/stock
Registrar entrada ou saída de material

```json
{
  "material": "Cimento",
  "quantity": 50,
  "unit": "saco",
  "type": "entrada",
  "location": "Depósito A",
  "message": "Compra fornecedor XYZ"
}
```

### GET /api/records
Listar todos os registros

### GET /api/summary
Resumo de estoque por material

### GET /api/dashboard-data
Dados para dashboard (gráficos + últimos registros)

## 🛠️ Tecnologias

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: TypeScript + Vite + Chart.js
- **Banco de Dados**: SQLite
- **UI**: Bootstrap 5

## 📦 Materiais Suportados

- Cimento
- Areia
- Brita
- Tijolo
- Telha
- Ferro
- Madeira
- Tinta
- Outros (personalizável)

## 💡 Exemplo de Uso via API

```bash
# Registrar entrada de cimento
curl -X POST http://localhost:5000/api/stock \
  -H "Content-Type: application/json" \
  -d '{
    "material": "Cimento",
    "quantity": 100,
    "unit": "saco",
    "type": "entrada",
    "location": "Depósito Central",
    "message": "Compra mensal"
  }'

# Registrar saída de areia
curl -X POST http://localhost:5000/api/stock \
  -H "Content-Type: application/json" \
  -d '{
    "material": "Areia",
    "quantity": -5,
    "unit": "m³",
    "type": "saida",
    "location": "Obra Residencial",
    "message": "Uso em contrapiso"
  }'
```

## 📝 Estrutura do Projeto

```
.
├── backend/                    # Backend Node.js + TypeScript
│   ├── src/
│   │   ├── server.ts          # Servidor Express + API REST
│   │   ├── db.ts              # Gerenciamento SQLite
│   │   └── initDb.ts          # Script de inicialização
│   ├── Dockerfile             # Container Docker do backend
│   ├── package.json           # Dependências Node.js
│   └── db.sqlite3             # Banco de dados SQLite
│
├── frontend/                   # Frontend TypeScript + Vite
│   ├── src/
│   │   └── main.ts            # Lógica do dashboard
│   ├── Dockerfile             # Container Docker do frontend
│   ├── nginx.conf             # Configuração Nginx
│   ├── index.html             # Interface do usuário
│   └── package.json           # Dependências Node.js
│
├── docker-compose.yml          # Orquestração Docker
├── exemplo-agente.py           # Exemplo de integração Python
└── README.md                   # Este arquivo
```



## 🧪 Testar a API

Execute o script de teste:
```cmd
testar-api.bat
```

Ou veja exemplos detalhados em [exemplo-api.md](exemplo-api.md)

## 📂 Arquivos Úteis

- `instalar.bat` - Instalação automática
- `iniciar-dev.bat` - Inicia em modo desenvolvimento
- `iniciar-producao.bat` - Inicia em modo produção
- `testar-api.bat` - Testa os endpoints da API
- `INSTALACAO.md` - Guia detalhado de instalação
- `exemplo-api.md` - Exemplos de uso da API

## 🎯 Próximos Passos (Opcional)

- Adicionar autenticação de usuários
- Exportar relatórios em PDF/Excel
- Notificações de estoque baixo
- Integração com código de barras
- App mobile
