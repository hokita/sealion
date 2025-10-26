import dotenv from 'dotenv';
import app from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`  - Groups: http://localhost:${PORT}/api/groups`);
  console.log(`  - Todos:  http://localhost:${PORT}/api/todos`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
    console.error(`Please stop the other process or use a different port.`);
    console.error(
      `To use a different port, set the PORT environment variable.`
    );
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});
