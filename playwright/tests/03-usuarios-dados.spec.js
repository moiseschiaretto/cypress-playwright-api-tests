const { test, expect } = require('@playwright/test');
const { usuarioReferencia } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

test.describe('Usuários — validação de dados', () => {
  test.beforeEach(async () => {
    await rotular('Usuários', 'Dados');
  });

  test('CT-016 - Consultar usuário por id retorna o usuário correto', async ({ request }) => {
    const resposta = await request.get(`/users/${usuarioReferencia.id}`);
    expect(resposta.status()).toBe(200);
    const usuario = await resposta.json();
    expect(usuario.firstName).toBe(usuarioReferencia.firstName);
    expect(usuario.username).toBe(usuarioReferencia.username);
    expect(usuario.role).toBe(usuarioReferencia.role);
  });

  test('CT-017 - E-mails dos usuários têm formato válido', async ({ request }) => {
    const corpo = await (await request.get('/users?limit=30')).json();
    for (const usuario of corpo.users) {
      expect(usuario.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });

  test('CT-018 - Filtro por cor de cabelo retorna somente usuários com a cor filtrada', async ({ request }) => {
    const corpo = await (await request.get('/users/filter?key=hair.color&value=Brown')).json();
    expect(corpo.users.length).toBeGreaterThan(0);
    for (const usuario of corpo.users) expect(usuario.hair.color).toBe('Brown');
  });

  test('CT-019 - Busca por nome encontra o usuário pesquisado', async ({ request }) => {
    const corpo = await (await request.get('/users/search?q=Emily')).json();
    expect(corpo.users.some((u) => u.firstName === 'Emily')).toBe(true);
  });

  test('CT-020 - Carrinhos do usuário pertencem ao próprio usuário', async ({ request }) => {
    const corpo = await (await request.get('/users/1/carts')).json();
    for (const carrinho of corpo.carts) expect(carrinho.userId).toBe(1);
  });

  test('CT-021 - Posts do usuário pertencem ao próprio usuário', async ({ request }) => {
    const corpo = await (await request.get('/users/1/posts')).json();
    for (const post of corpo.posts) expect(post.userId).toBe(1);
  });

  test('CT-022 - Tarefas do usuário pertencem ao próprio usuário', async ({ request }) => {
    const corpo = await (await request.get('/users/1/todos')).json();
    for (const tarefa of corpo.todos) expect(tarefa.userId).toBe(1);
  });
});
