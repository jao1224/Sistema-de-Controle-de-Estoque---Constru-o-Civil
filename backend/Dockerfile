# Backend Dockerfile - Node.js + TypeScript + Express + SQLite (Estrutura Melhorada)
FROM node:20-slim AS builder

# Instalar dependências de build
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Configurar npm para usar o registro oficial e aumentar timeout
RUN npm config set fetch-timeout 60000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Instalar todas as dependências (incluindo dev para build)
RUN npm install

# Copiar código fonte
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-slim

# Instalar dependências de runtime
RUN apt-get update && apt-get install -y sqlite3 wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Copiar node_modules do builder (já compilado para Linux)
COPY --from=builder /app/node_modules ./node_modules

# Copiar código compilado do builder
COPY --from=builder /app/dist ./dist

# Criar diretório para o banco de dados com permissões corretas
RUN mkdir -p /app/data && chown -R node:node /app /app/data

# Usar usuário não-root
USER node

# Expor porta
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/summary || exit 1

# Variáveis de ambiente
ENV NODE_ENV=production \
    PORT=5000

# Comando para iniciar
# O banco de dados será criado automaticamente na primeira execução
CMD ["node", "dist/server.js"]
