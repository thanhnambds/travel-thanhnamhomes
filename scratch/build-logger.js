import { spawn } from 'child_process';
import fs from 'fs';

const logFile = 'scratch/next-build.log';
// Clear log file
fs.writeFileSync(logFile, '');

console.log('Spawning next build with unbuffered logging...');

const child = spawn('npx', ['next', 'build'], {
  env: { ...process.env, FORCE_COLOR: '1' }
});

child.stdout.on('data', (data) => {
  const text = data.toString();
  fs.appendFileSync(logFile, text);
  process.stdout.write(text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  fs.appendFileSync(logFile, text);
  process.stderr.write(text);
});

child.on('close', (code) => {
  console.log(`\nProcess exited with code ${code}`);
  fs.appendFileSync(logFile, `\nProcess exited with code ${code}`);
});
