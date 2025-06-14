import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { fileRoutes } from './routes/fileRoutes';
import env from './utils/env';

const app = new Elysia()
  .use(
    cors({
      origin: true, // dynamically sets the origin header
      methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
  }))
  .use(fileRoutes)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return {
          success: false,
          error: 'Validation error',
          details: error.message,
        };
      case 'NOT_FOUND':
        set.status = 404;
        return { success: false, error: 'Route not found' };
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500;
        return { success: false, error: 'Internal server error' };
      default:
        set.status = 500;
        return { success: false, error: 'Unknown error occurred' };
    }
  })
  .listen(env.PORT);

console.log(
  `🦊 Windows Explorer Web Backend is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📁 File API available at http://localhost:${env.PORT}/api/files`);
console.log(`🔍 Health check available at http://localhost:${env.PORT}/health`);
