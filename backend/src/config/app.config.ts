// Configurações gerais da aplicação

export const appConfig = {
  // Autenticação
  auth: {
    enabled: process.env.AUTH_ENABLED === 'true',
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    sessionSecret: process.env.SESSION_SECRET || 'change-this-session-secret',
  },

  // Servidor
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
  },

  // Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE,
  },
};

// Log de configuração (apenas em desenvolvimento)
if (appConfig.server.nodeEnv === 'development') {
  console.log('📋 Configurações:');
  console.log(`   - Autenticação: ${appConfig.auth.enabled ? '✅ Ativada' : '⏸️  Desativada'}`);
  console.log(`   - Ambiente: ${appConfig.server.nodeEnv}`);
  console.log(`   - Porta: ${appConfig.server.port}`);
}
