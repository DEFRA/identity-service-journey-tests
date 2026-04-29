import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('SLACK_WEBHOOK_URL not set');
  process.exit(1);
}

const reportPath = path.resolve(__dirname, 'playwright-report/results.json');
if (!fs.existsSync(reportPath)) {
  console.error('Playwright report not found:', reportPath);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

function getAllTests(suites = []) {
  const tests = [];

  for (const suite of suites) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        if (spec.tests) {
          tests.push(...spec.tests);
        }
      }
    }
    if (suite.suites) {
      tests.push(...getAllTests(suite.suites));
    }
  }

  return tests;
}

const allTests = getAllTests(report.suites);
const failedTests = allTests.filter((t) => t.status === 'failed');

const baseText =
  failedTests.length === 0
    ? `✅ All Playwright tests passed! (${report.stats?.total ?? allTests.length} tests)`
    : `❌ Playwright tests failed!\n${failedTests.map((t) => `• ${t.title}`).join('\n')}`;

const message = {
  text: `${baseText}\n${process.env.BUILD_URL ?? ''}`,
};

axios
  .post(webhookUrl, message)
  .then(() => console.log('Slack notification sent!'))
  .catch((err) => {
    console.error('Error posting to Slack:', err);
    process.exitCode = 1;
  });
