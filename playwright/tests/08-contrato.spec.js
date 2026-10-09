const { test, expect } = require('@playwright/test');
const contratos = require('../../shared/contracts');
const { credenciais, ID_INEXISTENTE } = require('../../shared/dados');
const { validarSchema } = require('../../shared/validador');
const { rotular } = require('../../shared/allure');

// Contrato rígido: campos exatos, tipos, valores permitidos e nenhum campo extra
test.describe('Contrato — acordo entre a API e o consumidor', () => {
  test.beforeEach(async () => {
    await rotular('Contrato', 'Contrato');
  });

  test('CT-051 - Contrato do produto (campos exatos, sem campos extras)', async ({ request }) => {
    const produto = await (await request.get('/products/1')).json();
    expect(validarSchema(contratos.produto, produto)).toEqual([]);
  });

  test('CT-052 - Contrato da paginação de produtos', async ({ request }) => {
    const corpo = await (await request.get('/products?limit=5')).json();
    expect(validarSchema(contratos.paginacaoProdutos, corpo)).toEqual([]);
  });

  test('CT-053 - Contrato da paginação de usuários', async ({ request }) => {
    const corpo = await (await request.get('/users?limit=5')).json();
    expect(validarSchema(contratos.paginacaoUsuarios, corpo)).toEqual([]);
  });

  test('CT-054 - Contrato da resposta de login', async ({ request }) => {
    const corpo = await (await request.post('/auth/login', { data: credenciais })).json();
    expect(validarSchema(contratos.login, corpo)).toEqual([]);
  });

  test('CT-055 - Contrato de post e de tarefa', async ({ request }) => {
    const post = await (await request.get('/posts/1')).json();
    const tarefa = await (await request.get('/todos/1')).json();
    expect(validarSchema(contratos.post, post)).toEqual([]);
    expect(validarSchema(contratos.tarefa, tarefa)).toEqual([]);
  });

  test('CT-056 - Status de disponibilidade dos produtos respeita os valores permitidos', async ({ request }) => {
    const corpo = await (await request.get('/products?limit=0&select=availabilityStatus')).json();
    for (const produto of corpo.products) {
      expect(validarSchema(contratos.produto.properties.availabilityStatus, produto.availabilityStatus)).toEqual([]);
    }
  });

  test('CT-057 - Perfil (role) dos usuários respeita os valores permitidos', async ({ request }) => {
    const corpo = await (await request.get('/users?limit=0&select=role')).json();
    for (const usuario of corpo.users) {
      expect(validarSchema(contratos.usuarioRole, usuario)).toEqual([]);
    }
  });

  test('CT-058 - Contrato de erro: recurso inexistente retorna mensagem', async ({ request }) => {
    const resposta = await request.get(`/products/${ID_INEXISTENTE}`);
    expect(resposta.status()).toBe(404);
    expect(validarSchema(contratos.erro, await resposta.json())).toEqual([]);
  });
});
