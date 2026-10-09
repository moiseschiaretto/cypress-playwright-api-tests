const fs = require('fs');
const { defineConfig } = require('@playwright/test');
const { API_URL } = require('./shared/dados');

const PASTA_ALLURE = 'allure-results/playwright';

// Apaga os resultados Allure da execução anterior (só no processo principal)
if (!process.env.TEST_WORKER_INDEX) {
  fs.rmSync(PASTA_ALLURE, { recursive: true, force: true });
}

module.exports = defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  retries: 0,
  timeout: 30000,
  reporter: [
    ['list'],
    // Relatório padrão
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    // Relatório Allure
    ['allure-playwright', { resultsDir: PASTA_ALLURE }],
  ],
  use: {
    baseURL: process.env.API_URL || API_URL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' },
  },
});
