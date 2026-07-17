import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis;

function buildClient() {
  const client = new PrismaClient({
    log:
      env.nodeEnv === 'development'
        ? [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'warn' }, { emit: 'stdout', level: 'error' }]
        : [{ emit: 'stdout', level: 'error' }],
  });

  // Phase 4 (DB optimization): surface slow queries during development
  // instead of only finding out about them in production. Threshold is
  // configurable via SLOW_QUERY_THRESHOLD_MS.
  if (env.nodeEnv === 'development') {
    client.$on('query', (e) => {
      if (e.duration >= env.slowQueryThresholdMs) {
        console.warn(`[SLOW QUERY] ${e.duration}ms — ${e.query} — params: ${e.params}`);
      }
    });
  }

  return client;
}

export const prisma = globalForPrisma.__prisma || buildClient();

if (env.nodeEnv !== 'production') {
  globalForPrisma.__prisma = prisma;
}
