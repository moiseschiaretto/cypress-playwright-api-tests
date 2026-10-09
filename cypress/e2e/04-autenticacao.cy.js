const { credenciais } = require('../../shared/dados');
const { decodificarJwt } = require('../../shared/validador');
const { rotular } = require('../../shared/allure');

const FORMATO_JWT = /^[\w-]+\.[\w-]+\.[\w-]+$/;

const fazerLogin = () => cy.request('POST', '/auth/login', credenciais).its('body');

describe('Autenticação — login e token JWT', () => {
  beforeEach(() => {
    rotular('Autenticação', 'Segurança');
  });

  it('CT-023 - Login válido retorna tokens JWT e dados do usuário', () => {
    cy.request('POST', '/auth/login', credenciais).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.username).to.eq(credenciais.username);
      expect(body.accessToken).to.match(FORMATO_JWT);
      expect(body.refreshToken).to.match(FORMATO_JWT);
    });
  });

  it('CT-024 - Login com senha inválida é recusado', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: { username: credenciais.username, password: 'senha-errada' },
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.message).to.be.a('string');
    });
  });

  it('CT-025 - Login sem usuário e senha é recusado', () => {
    cy.request({ method: 'POST', url: '/auth/login', body: {}, failOnStatusCode: false })
      .its('status')
      .should('eq', 400);
  });

  it('CT-026 - Consultar usuário autenticado com token válido', () => {
    fazerLogin().then(({ accessToken }) => {
      cy.request({ url: '/auth/me', headers: { Authorization: `Bearer ${accessToken}` } }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.username).to.eq(credenciais.username);
      });
    });
  });

  it('CT-027 - Consultar usuário autenticado sem token é recusado', () => {
    cy.request({ url: '/auth/me', failOnStatusCode: false }).its('status').should('eq', 401);
  });

  it('CT-028 - Consultar usuário autenticado com token inválido é recusado', () => {
    cy.request({ url: '/auth/me', headers: { Authorization: 'Bearer token.invalido.123' }, failOnStatusCode: false })
      .its('status')
      .should('be.at.least', 400);
  });

  it('CT-029 - Token JWT contém o usuário e data de expiração posterior à emissão', () => {
    fazerLogin().then(({ accessToken }) => {
      const payload = decodificarJwt(accessToken);
      expect(payload.username).to.eq(credenciais.username);
      expect(payload.exp).to.be.greaterThan(payload.iat);
    });
  });

  it('CT-030 - Renovar sessão com refresh token gera novo access token', () => {
    fazerLogin().then(({ refreshToken }) => {
      cy.request('POST', '/auth/refresh', { refreshToken }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.accessToken).to.match(FORMATO_JWT);
      });
    });
  });
});
