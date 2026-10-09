const { test, expect } = require('@playwright/test');
const { novoCarrinho } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

const somar = (lista, campo) => lista.reduce((total, item) => total + item[campo], 0);

test.describe('Carrinhos — regras de cálculo', () => {
  test.beforeEach(async () => {
    await rotular('Carrinhos', 'Dados');
  });

  test('CT-031 - Total de produtos e de itens do carrinho conferem com a lista', async ({ request }) => {
    const carrinho = await (await request.get('/carts/1')).json();
    expect(carrinho.totalProducts).toBe(carrinho.products.length);
    expect(carrinho.totalQuantity).toBe(somar(carrinho.products, 'quantity'));
  });

  test('CT-032 - Total de cada item é preço vezes quantidade', async ({ request }) => {
    const carrinho = await (await request.get('/carts/1')).json();
    for (const item of carrinho.products) {
      expect(item.total).toBeCloseTo(item.price * item.quantity, 1);
    }
  });

  test('CT-033 - Total do carrinho é a soma dos totais dos itens', async ({ request }) => {
    const carrinho = await (await request.get('/carts/1')).json();
    expect(carrinho.total).toBeCloseTo(somar(carrinho.products, 'total'), 1);
  });

  test('CT-034 - Total com desconto não ultrapassa o total sem desconto', async ({ request }) => {
    const corpo = await (await request.get('/carts?limit=10')).json();
    for (const carrinho of corpo.carts) {
      expect(carrinho.discountedTotal).toBeLessThanOrEqual(carrinho.total);
    }
  });

  test('CT-035 - Incluir carrinho calcula quantidade total e mantém o usuário', async ({ request }) => {
    const resposta = await request.post('/carts/add', { data: novoCarrinho });
    expect([200, 201]).toContain(resposta.status());
    const carrinho = await resposta.json();
    expect(carrinho.userId).toBe(novoCarrinho.userId);
    expect(carrinho.totalProducts).toBe(novoCarrinho.products.length);
    expect(carrinho.totalQuantity).toBe(somar(novoCarrinho.products, 'quantity'));
  });
});
