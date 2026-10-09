const { test, expect } = require('@playwright/test');
const { rotular } = require('../../shared/allure');

test.describe('Posts, comentários e tarefas — validação de dados', () => {
  test.beforeEach(async () => {
    await rotular('Posts, comentários e tarefas', 'Dados');
  });

  test('CT-036 - Post possui reações e visualizações não negativas', async ({ request }) => {
    const post = await (await request.get('/posts/1')).json();
    expect(post.id).toBe(1);
    expect(post.reactions.likes).toBeGreaterThanOrEqual(0);
    expect(post.reactions.dislikes).toBeGreaterThanOrEqual(0);
    expect(post.views).toBeGreaterThanOrEqual(0);
  });

  test('CT-037 - Posts por tag contêm a tag pesquisada', async ({ request }) => {
    const corpo = await (await request.get('/posts/tag/love')).json();
    expect(corpo.posts.length).toBeGreaterThan(0);
    for (const post of corpo.posts) expect(post.tags).toContain('love');
  });

  test('CT-038 - Comentários de um post pertencem ao próprio post', async ({ request }) => {
    const corpo = await (await request.get('/posts/1/comments')).json();
    for (const comentario of corpo.comments) expect(comentario.postId).toBe(1);
  });

  test('CT-039 - Tarefa possui status de conclusão booleano', async ({ request }) => {
    const tarefa = await (await request.get('/todos/1')).json();
    expect(tarefa.id).toBe(1);
    expect(typeof tarefa.completed).toBe('boolean');
  });

  test('CT-040 - Tarefa aleatória retorna uma tarefa válida', async ({ request }) => {
    const tarefa = await (await request.get('/todos/random')).json();
    expect(tarefa.id).toBeGreaterThan(0);
    expect(typeof tarefa.todo).toBe('string');
  });
});
