# Ambientes Docker Separados

Este projeto possui ambientes Docker separados para **desenvolvimento** e **produção**.

## 📋 Resumo dos Ambientes

| Ambiente | Arquivo | Frontend | Backend | Postgres | Banco de Dados |
|----------|---------|----------|---------|----------|----------------|
| **DEV** | `docker-compose.dev.yml` | http://localhost:8080 | http://localhost:5001 | porta 5433 | `buildstock_dev` |
| **PROD** | `docker-compose.prod.yml` | http://localhost:80 | http://localhost:5000 | porta 5432 | `buildstock_prod` |

## 🚀 Como Usar

### Ambiente de Desenvolvimento (DEV)

```bash
# Iniciar ambiente DEV
docker-compose -f docker-compose.dev.yml up -d --build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar ambiente DEV
docker-compose -f docker-compose.dev.yml down

# Parar e remover volumes (apaga dados)
docker-compose -f docker-compose.dev.yml down -v
```

**Acessar:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5001/api
- Postgres: localhost:5433

### Ambiente de Produção (PROD)

```bash
# Iniciar ambiente PROD
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar ambiente PROD
docker-compose -f docker-compose.prod.yml down

# Parar e remover volumes (apaga dados)
docker-compose -f docker-compose.prod.yml down -v
```

**Acessar:**
- Frontend: http://localhost:80
- Backend API: http://localhost:5000/api
- Postgres: localhost:5432

## 🔄 Workflow Recomendado

### Branch `dev` → Usar ambiente DEV
```bash
git checkout dev
docker-compose -f docker-compose.dev.yml up -d --build
```

### Branch `main` → Usar ambiente PROD
```bash
git checkout main
docker-compose -f docker-compose.prod.yml up -d --build
```

## ⚙️ Diferenças entre Ambientes

### DEV (Desenvolvimento)
- ✅ Portas diferentes (8080, 5001, 5433)
- ✅ Banco de dados separado (`buildstock_dev`)
- ✅ Containers com sufixo `-dev`
- ✅ `NODE_ENV=development`
- ✅ Cache desabilitado no nginx
- ✅ Ideal para testes e desenvolvimento

### PROD (Produção)
- ✅ Portas padrão (80, 5000, 5432)
- ✅ Banco de dados separado (`buildstock_prod`)
- ✅ Containers com sufixo `-prod`
- ✅ `NODE_ENV=production`
- ✅ Otimizações de produção
- ✅ Ideal para deploy final

## 🗄️ Dados Isolados

Cada ambiente tem seu próprio volume de banco de dados:
- DEV: `postgres-data-dev`
- PROD: `postgres-data-prod`

**Isso significa que os dados não são compartilhados entre ambientes!**

## 🔧 Comandos Úteis

### Rodar ambos os ambientes simultaneamente
```bash
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.prod.yml up -d
```

### Ver todos os containers
```bash
docker ps
```

### Acessar banco de dados DEV
```bash
docker exec -it buildstock-postgres-dev psql -U postgres -d buildstock_dev
```

### Acessar banco de dados PROD
```bash
docker exec -it buildstock-postgres-prod psql -U postgres -d buildstock_prod
```

## 📝 Notas Importantes

1. **Sempre especifique o arquivo** com `-f docker-compose.dev.yml` ou `-f docker-compose.prod.yml`
2. **Os dois ambientes podem rodar ao mesmo tempo** (portas diferentes)
3. **Dados são isolados** - mudanças no DEV não afetam PROD
4. **Sempre faça backup** antes de executar `down -v` (apaga dados)

## 🎯 Boas Práticas

- ✅ Use **DEV** para desenvolvimento e testes
- ✅ Use **PROD** apenas para validação final antes do deploy
- ✅ Faça backup regular do volume `postgres-data-prod`
- ✅ Nunca execute `down -v` em produção sem backup
- ✅ Teste no DEV antes de fazer merge para main
