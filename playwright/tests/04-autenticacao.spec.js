const { test, expect } = require('@playwright/test');
const { credenciais } = require('../../shared/dados');
const { decodificarJwt } = require('../../shared/validador');
const { rotular } = require('../../shared/allure');

const FORMATO_JWT = /^[\w-]+\.[\w-]+\.[\w-]+$/;

async function fazerLogin(request) {
  const resposta = await request.post('/auth/login', { data: credenciais });
  return resposta.json();
}

test.describe('Autenticação — login e token JWT', () => {
  test.beforeEach(async () => {
    await rotular('Autenticação', 'Segurança');
  });

  test('CT-023 - Login válido retorna tokens JWT e dados do usuário', async ({ request }) => {
    const resposta = await request.post('/auth/login', { data: credenciais });
    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.username).toBe(credenciais.username);
    expect(corpo.accessToken).toMatch(FORMATO_JWT);
    expect(corpo.refreshToken).toMatch(FORMATO_JWT);
  });

  test('CT-024 - Login com senha inválida é recusado', async ({ request }) => {
    const resposta = await request.post('/auth/login', { data: { username: credenciais.username, password: 'senha-errada' } });
    expect(resposta.status()).toBe(400);
    expect(typeof (await resposta.json()).message).toBe('string');
  });

  test('CT-025 - Login sem usuário e senha é recusado', async ({ request }) => {
    const resposta = await request.post('/auth/login', { data: {} });
    expect(resposta.status()).toBe(400);
  });

  test('CT-026 - Consultar usuário autenticado com token válido', async ({ request }) => {
    const { accessToken } = await fazerLogin(request);
    const resposta = await request.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).username).toBe(credenciais.username);
  });

  test('CT-027 - Consultar usuário autenticado sem token é recusado', async ({ request }) => {
    const resposta = await request.get('/auth/me');
    expect(resposta.status()).toBe(401);
  });

  test('CT-028 - Consultar usuário autenticado com token inválido é recusado', async ({ request }) => {
    const resposta = await request.get('/auth/me', { headers: { Authorization: 'Bearer token.invalido.123' } });
    expect(resposta.status()).toBeGreaterThanOrEqual(400);
  });

  test('CT-029 - Token JWT contém o usuário e data de expiração posterior à emissão', async ({ request }) => {
    const { accessToken } = await fazerLogin(request);
    const payload = decodificarJwt(accessToken);
    expect(payload.username).toBe(credenciais.username);
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  test('CT-030 - Renovar sessão com refresh token gera novo access token', async ({ request }) => {
    const { refreshToken } = await fazerLogin(request);
    const resposta = await request.post('/auth/refresh', { data: { refreshToken } });
    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).accessToken).toMatch(FORMATO_JWT);
  });
});
