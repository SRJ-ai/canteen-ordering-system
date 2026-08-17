/**
 * GPREC Master Quality Assurance Runner
 * Runs Mutation Testing (Stryker), a11y (WCAG 2.1 AA), E2E Lifecycle, and Concurrency Load Suites.
 */

const { execSync } = require('child_process');

console.log('================================================================');
console.log('🚀 EXECUTING GPREC ENTERPRISE QUALITY & TESTING MATRIX (4 SUITES)');
console.log('================================================================\n');

const suites = [
  { name: '1. Mutation Testing (StrykerJS Model)', file: 'tests/mutation.test.js' },
  { name: '2. Accessibility (a11y) & WCAG 2.1 AA', file: 'tests/a11y.test.js' },
  { name: '3. End-to-End (E2E) Lifecycle', file: 'tests/e2e.test.js' },
  { name: '4. Load & Concurrency (200 Virtual Users)', file: 'tests/load_concurrency.test.js' },
];

let allPassed = true;

for (const suite of suites) {
  try {
    const output = execSync(`node ${suite.file}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Suite Failed: ${suite.name}`);
    allPassed = false;
  }
  console.log('\n');
}

console.log('================================================================');
if (allPassed) {
  console.log('🏆 ALL 4 ENTERPRISE TEST SUITES PASSED WITH 100% SUCCESS!');
} else {
  console.log('⚠️ Some test suites reported failures.');
}
console.log('================================================================');
