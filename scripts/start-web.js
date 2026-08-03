const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const http = require('http');

const API_PORT = 3001;
const API_HEALTH_URL = `http://127.0.0.1:${API_PORT}/api/health`;
const API_SCRIPT = path.join(__dirname, '..', 'server', 'index.js');
const PROJECT_ROOT = path.join(__dirname, '..');

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port, '127.0.0.1');
  });
}

function waitForApi(maxAttempts = 30, interval = 1000) {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      http.get(API_HEALTH_URL, (res) => {
        resolve(true);
      }).on('error', () => {
        attempts++;
        if (attempts >= maxAttempts) {
          resolve(false);
        } else {
          setTimeout(check, interval);
        }
      });
    };

    check();
  });
}

async function main() {
  let apiProcess = null;

  const apiRunning = await isPortInUse(API_PORT);

  if (!apiRunning) {
    console.log('Starting API server...');
    apiProcess = spawn('node', [API_SCRIPT], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true,
    });

    apiProcess.on('error', (err) => {
      console.error('Failed to start API server:', err);
    });

    console.log('Waiting for API server to be ready...');
    const ready = await waitForApi();
    if (!ready) {
      console.error('API server did not become ready in time.');
      process.exit(1);
    }
    console.log('API server is ready.');
  } else {
    console.log('API server already running on port', API_PORT);
  }

  console.log('Starting Expo web...');
  const expo = spawn('npx', ['expo', 'start', '--web'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true,
  });

  expo.on('error', (err) => {
    console.error('Failed to start Expo:', err);
  });

  const cleanup = () => {
    if (apiProcess) {
      console.log('\nStopping API server...');
      apiProcess.kill('SIGTERM');
    }
    expo.kill('SIGTERM');
  };

  expo.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main();
