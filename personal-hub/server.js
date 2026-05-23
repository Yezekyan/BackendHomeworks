'use strict';

const app = require('./src/app');
const { PORT } = require('./src/config/env');

const server = app.listen(PORT, () => {
  console.log(
    `[server] PID ${process.pid} — listening on http://localhost:${PORT}`,
  );
});

function shutdown(signal) {
  console.log(`[server] ${signal} received — shutting down gracefully…`);
  server.close(() => {
    console.log('[server] all connections closed — process exiting');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[server] forced exit after 5 s');
    process.exit(1);
  }, 5_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[server] unhandledRejection:', reason);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('[server] uncaughtException:', err);
  shutdown('uncaughtException');
});
