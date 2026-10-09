const { test, expect } = require('@playwright/test');
const { ID_INEXISTENTE, TEMPO_MAXIMO_MS } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

test.describe('HTTP — status, cenários negativos, cabeçalhos e tempo de resposta', () => {
  test.beforeEach(async () => {
    await rotular('HTTP', 'Negativos e cabeçalhos');
  });

  test('CT-059 - Produto inexistente retorna 404 com mensagem "not found"', async ({ request }) => {
    const resposta = await request.get(`/products/${ID_INEXISTENTE}`);
    expect(resposta.status()).toBe(404);
    expect((await resposta.json()).message.toLowerCase()).toContain('not found');
  });

  test('CT-060 - Usuário inexistente retorna 404', async ({ request }) => {
    const resposta = await request.get(`/users/${ID_INEXISTENTE}`);
    expect(resposta.status()).toBe(404);
  });

  test('CT-061 - Rota inexistente retorna 404', async ({ request }) => {
    const resposta = await request.get('/rota-que-nao-existe');
    expect(resposta.status()).toBe(404);
  });

  test('CT-062 - Endpoint de status HTTP 200 retorna a mensagem padrão', async ({ request }) => {
    const resposta = await request.get('/http/200');
    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(Number(corpo.status)).toBe(200);
    expect(corpo.message).toBe('OK');
  });

  test('CT-063 - Endpoint de status HTTP 404 retorna mensagem personalizada', async ({ request }) => {
    const resposta = await request.get('/http/404/Recurso_inexistente');
    expect(resposta.status()).toBe(404);
    expect((await resposta.json()).message).toBe('Recurso_inexistente');
  });

  test('CT-064 - Endpoint de status HTTP 500 simula erro interno do servidor', async ({ request }) => {
    const resposta = await request.get('/http/500');
    expect(resposta.status()).toBe(500);
  });

  test('CT-065 - Resposta é JSON (cabeçalho Content-Type)', async ({ request }) => {
    const resposta = await request.get('/products/1');
    expect(resposta.headers()['content-type']).toContain('application/json');
  });

  test(`CT-066 - Tempo de resposta abaixo de ${TEMPO_MAXIMO_MS} ms`, async ({ request }) => {
    const inicio = Date.now();
    const resposta = await request.get('/products/1');
    const duracao = Date.now() - inicio;
    expect(resposta.status()).toBe(200);
    expect(duracao).toBeLessThan(TEMPO_MAXIMO_MS);
  });
});
