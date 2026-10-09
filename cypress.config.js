const fs = require('fs');
const { defineConfig } = require('cypress');
const { allureCypress } = require('allure-cypress/reporter');
const cypressOnFix = require('cypress-on-fix');
const { API_URL } = require('./shared/dados');

const PASTA_ALLURE = 'allure-results/cypress';

module.exports = defineConfig({
  // Relatório padrão: HTML do Mochawesome
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports/cypress',
    reportPageTitle: 'Testes de API — Cypress',
    charts: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: process.env.API_URL || API_URL,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,

    setupNodeEvents(on, config) {
      // cypress-on-fix: permite que o Mochawesome e o Allure usem os mesmos eventos do Cypress
      on = cypressOnFix(on);

      require('cypress-mochawesome-reporter/plugin')(on);

      // Relatório Allure (resultados da execução anterior são apagados)
      fs.rmSync(PASTA_ALLURE, { recursive: true, force: true });
      allureCypress(on, config, { resultsDir: PASTA_ALLURE });

      return config;
    },
  },
});
