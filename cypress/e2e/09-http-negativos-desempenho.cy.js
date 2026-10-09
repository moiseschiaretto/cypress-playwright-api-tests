const { ID_INEXISTENTE, TEMPO_MAXIMO_MS } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

const requisitar = (url) => cy.request({ url, failOnStatusCode: false });

describe('HTTP — status, cenários negativos, cabeçalhos e tempo de resposta', () => {
  beforeEach(() => {
    rotular('HTTP', 'Negativos e cabeçalhos');
  });

  it('CT-059 - Produto inexistente retorna 404 com mensagem "not found"', () => {
    requisitar(`/products/${ID_INEXISTENTE}`).then(({ status, body }) => {
      expect(status).to.eq(404);
      expect(body.message.toLowerCase()).to.contain('not found');
    });
  });

  it('CT-060 - Usuário inexistente retorna 404', () => {
    requisitar(`/users/${ID_INEXISTENTE}`).its('status').should('eq', 404);
  });

  it('CT-061 - Rota inexistente retorna 404', () => {
    requisitar('/rota-que-nao-existe').its('status').should('eq', 404);
  });

  it('CT-062 - Endpoint de status HTTP 200 retorna a mensagem padrão', () => {
    requisitar('/http/200').then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(Number(body.status)).to.eq(200);
      expect(body.message).to.eq('OK');
    });
  });

  it('CT-063 - Endpoint de status HTTP 404 retorna mensagem personalizada', () => {
    requisitar('/http/404/Recurso_inexistente').then(({ status, body }) => {
      expect(status).to.eq(404);
      expect(body.message).to.eq('Recurso_inexistente');
    });
  });

  it('CT-064 - Endpoint de status HTTP 500 simula erro interno do servidor', () => {
    requisitar('/http/500').its('status').should('eq', 500);
  });

  it('CT-065 - Resposta é JSON (cabeçalho Content-Type)', () => {
    requisitar('/products/1').its('headers').its('content-type').should('contain', 'application/json');
  });

  it(`CT-066 - Tempo de resposta abaixo de ${TEMPO_MAXIMO_MS} ms`, () => {
    requisitar('/products/1').then(({ status, duration }) => {
      expect(status).to.eq(200);
      expect(duration).to.be.lessThan(TEMPO_MAXIMO_MS);
    });
  });
});
