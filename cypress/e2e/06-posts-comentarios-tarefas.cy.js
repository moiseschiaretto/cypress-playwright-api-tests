const { rotular } = require('../../shared/allure');

describe('Posts, comentários e tarefas — validação de dados', () => {
  beforeEach(() => {
    rotular('Posts, comentários e tarefas', 'Dados');
  });

  it('CT-036 - Post possui reações e visualizações não negativas', () => {
    cy.request('/posts/1').its('body').then((post) => {
      expect(post.id).to.eq(1);
      expect(post.reactions.likes).to.be.at.least(0);
      expect(post.reactions.dislikes).to.be.at.least(0);
      expect(post.views).to.be.at.least(0);
    });
  });

  it('CT-037 - Posts por tag contêm a tag pesquisada', () => {
    cy.request('/posts/tag/love').its('body.posts').then((posts) => {
      expect(posts.length).to.be.greaterThan(0);
      posts.forEach((post) => expect(post.tags).to.include('love'));
    });
  });

  it('CT-038 - Comentários de um post pertencem ao próprio post', () => {
    cy.request('/posts/1/comments').its('body.comments').each((comentario) => {
      expect(comentario.postId).to.eq(1);
    });
  });

  it('CT-039 - Tarefa possui status de conclusão booleano', () => {
    cy.request('/todos/1').its('body').then((tarefa) => {
      expect(tarefa.id).to.eq(1);
      expect(tarefa.completed).to.be.a('boolean');
    });
  });

  it('CT-040 - Tarefa aleatória retorna uma tarefa válida', () => {
    cy.request('/todos/random').its('body').then((tarefa) => {
      expect(tarefa.id).to.be.greaterThan(0);
      expect(tarefa.todo).to.be.a('string');
    });
  });
});
