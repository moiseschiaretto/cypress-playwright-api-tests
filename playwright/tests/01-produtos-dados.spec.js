const { test, expect } = require('@playwright/test');
const { produtoReferencia } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

test.describe('Produtos — validação de dados', () => {
  test.beforeEach(async () => {
    await rotular('Produtos', 'Dados');
  });

  test('CT-001 - Consultar produto por id retorna o produto correto', async ({ request }) => {
    const resposta = await request.get(`/products/${produtoReferencia.id}`);
    expect(resposta.status()).toBe(200);
    const produto = await resposta.json();
    expect(produto.id).toBe(produtoReferencia.id);
    expect(produto.title).toBe(produtoReferencia.title);
    expect(produto.category).toBe(produtoReferencia.category);
  });

  test('CT-002 - Produto possui preço, desconto, avaliação e estoque em faixas válidas', async ({ request }) => {
    const produto = await (await request.get('/products/1')).json();
    expect(produto.price).toBeGreaterThan(0);
    expect(produto.discountPercentage).toBeGreaterThanOrEqual(0);
    expect(produto.discountPercentage).toBeLessThanOrEqual(100);
    expect(produto.rating).toBeGreaterThanOrEqual(0);
    expect(produto.rating).toBeLessThanOrEqual(5);
    expect(produto.stock).toBeGreaterThanOrEqual(0);
  });

  test('CT-003 - Listagem padrão retorna 30 produtos a partir do início', async ({ request }) => {
    const corpo = await (await request.get('/products')).json();
    expect(corpo.limit).toBe(30);
    expect(corpo.skip).toBe(0);
    expect(corpo.products).toHaveLength(30);
    expect(corpo.total).toBeGreaterThanOrEqual(30);
  });

  test('CT-004 - Paginação com limit e skip retorna a página correta', async ({ request }) => {
    const corpo = await (await request.get('/products?limit=10&skip=10')).json();
    expect(corpo.limit).toBe(10);
    expect(corpo.skip).toBe(10);
    expect(corpo.products).toHaveLength(10);
    expect(corpo.products[0].id).toBe(11);
  });

  test('CT-005 - Parâmetro select retorna somente os campos solicitados', async ({ request }) => {
    const corpo = await (await request.get('/products?limit=5&select=title,price')).json();
    for (const produto of corpo.products) {
      expect(Object.keys(produto).sort()).toEqual(['id', 'price', 'title']);
    }
  });

  test('CT-006 - Ordenação por preço crescente', async ({ request }) => {
    const corpo = await (await request.get('/products?sortBy=price&order=asc&limit=20')).json();
    const precos = corpo.products.map((p) => p.price);
    expect(precos).toEqual([...precos].sort((a, b) => a - b));
  });

  test('CT-007 - Ordenação por preço decrescente', async ({ request }) => {
    const corpo = await (await request.get('/products?sortBy=price&order=desc&limit=20')).json();
    const precos = corpo.products.map((p) => p.price);
    expect(precos).toEqual([...precos].sort((a, b) => b - a));
  });

  test('CT-008 - Busca por termo retorna resultados coerentes com o total', async ({ request }) => {
    const corpo = await (await request.get('/products/search?q=phone')).json();
    expect(corpo.total).toBeGreaterThan(0);
    expect(corpo.products.length).toBe(Math.min(corpo.total, corpo.limit));
  });

  test('CT-009 - Produtos por categoria pertencem somente à categoria pesquisada', async ({ request }) => {
    const corpo = await (await request.get('/products/category/smartphones')).json();
    expect(corpo.products.length).toBeGreaterThan(0);
    for (const produto of corpo.products) {
      expect(produto.category).toBe('smartphones');
    }
  });

  test('CT-010 - Lista de categorias contém categorias conhecidas', async ({ request }) => {
    const categorias = await (await request.get('/products/category-list')).json();
    expect(Array.isArray(categorias)).toBe(true);
    expect(categorias).toEqual(expect.arrayContaining(['beauty', 'smartphones']));
    for (const categoria of categorias) expect(typeof categoria).toBe('string');
  });

  test('CT-011 - URL de cada categoria aponta para o próprio slug', async ({ request }) => {
    const categorias = await (await request.get('/products/categories')).json();
    for (const categoria of categorias) {
      expect(categoria.url).toContain(`/products/category/${categoria.slug}`);
    }
  });
});
