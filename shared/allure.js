// Rótulos do Allure: organizam os cenários nas abas Behaviors e Suites
const allure = require('allure-js-commons');

async function rotular(funcionalidade, tipo) {
  await allure.epic('API DummyJSON');
  await allure.feature(funcionalidade);
  await allure.story(tipo);
  await allure.tag(tipo);
}

module.exports = { rotular };
