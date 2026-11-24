'use strict';

const { spawn, spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

const children = new Set();
const isWindows = process.platform === 'win32';
let stopping = false;

function stop(exitCode) {
  if (stopping) {
    return;
  }

  stopping = true;
  process.exitCode = exitCode;

  for (const child of children) {
    if (child.pid === undefined) {
      continue;
    }

    if (isWindows) {
      spawnSync('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
      continue;
    }

    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch (error) {
      if (error.code !== 'ESRCH') {
        throw error;
      }
    }
  }
}

function start(packageDirectory, script, args = []) {
  const child = spawn(process.execPath, [process.env.npm_execpath, 'run', script, ...args], {
    cwd: resolve(__dirname, '..', packageDirectory),
    // Keep npm and its service in a process group we can stop without signaling the caller.
    detached: !isWindows,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  children.add(child);
  child.once('error', (error) => {
    children.delete(child);
    console.error(`Could not start ${packageDirectory}: ${error.message}`);
    stop(1);
  });
  child.once('exit', (code, signal) => {
    if (!stopping) {
      console.error(`${packageDirectory} stopped (${signal ?? `exit code ${code}`}).`);
      stop(code || 1);
    }
    children.delete(child);
  });
}

process.on('SIGINT', () => stop(130));
process.on('SIGTERM', () => stop(143));

start('cms', 'develop');
const frontendPort = process.env.FRONTEND_PORT;
start('frontend', 'start', frontendPort ? ['--', '--port', frontendPort] : []);
