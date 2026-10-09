const { test, expect } = require('@playwright/test');
const { novoProduto } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

// Na DummyJSON, inclusão, alteração e exclusão são simuladas: a API responde
// como se gravasse, mas não altera os dados no servidor.
test.describe('Produtos — inclusão, alteração e exclusão (CRUD)', () => {
  test.beforeEach(async () => {
    await rotular('Produtos', 'CRUD');
  });

  test('CT-012 - Incluir produto retorna o produto criado com novo id', async ({ request }) => {
    const resposta = await request.post('/products/add', { data: novoProduto });
    expect([200, 201]).toContain(resposta.status());
    const produto = await resposta.json();
    expect(produto.id).toBeGreaterThan(0);
    expect(produto.title).toBe(novoProduto.title);
    expect(produto.price).toBe(novoProduto.price);
  });

  test('CT-013 - Alterar produto com PUT atualiza o título', async ({ request }) => {
    const resposta = await request.put('/products/1', { data: { title: 'Titulo alterado via PUT' } });
    expect(resposta.status()).toBe(200);
    const produto = await resposta.json();
    expect(produto.id).toBe(1);
    expect(produto.title).toBe('Titulo alterado via PUT');
  });

  test('CT-014 - Alterar produto com PATCH atualiza somente o preço', async ({ request }) => {
    const resposta = await request.patch('/products/1', { data: { price: 12.34 } });
    expect(resposta.status()).toBe(200);
    const produto = await resposta.json();
    expect(produto.id).toBe(1);
    expect(produto.price).toBe(12.34);
  });

  test('CT-015 - Excluir produto retorna isDeleted e data de exclusão', async ({ request }) => {
    const resposta = await request.delete('/products/1');
    expect(resposta.status()).toBe(200);
    const produto = await resposta.json();
    expect(produto.isDeleted).toBe(true);
    expect(Number.isNaN(Date.parse(produto.deletedOn))).toBe(false);
  });
});
