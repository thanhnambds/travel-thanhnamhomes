import { execSync } from 'child_process';

console.log('Starting synchronous next build...');
try {
  const output = execSync('npx next build', { encoding: 'utf8', stdio: 'pipe' });
  console.log('BUILD SUCCESSFUL!');
  console.log(output);
} catch (error) {
  console.error('BUILD FAILED!');
  console.error('STDOUT:', error.stdout);
  console.error('STDERR:', error.stderr);
  process.exit(1);
}
