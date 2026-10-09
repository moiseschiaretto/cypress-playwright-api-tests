const { usuarioReferencia } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

describe('Usuários — validação de dados', () => {
  beforeEach(() => {
    rotular('Usuários', 'Dados');
  });

  it('CT-016 - Consultar usuário por id retorna o usuário correto', () => {
    cy.request(`/users/${usuarioReferencia.id}`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.firstName).to.eq(usuarioReferencia.firstName);
      expect(body.username).to.eq(usuarioReferencia.username);
      expect(body.role).to.eq(usuarioReferencia.role);
    });
  });

  it('CT-017 - E-mails dos usuários têm formato válido', () => {
    cy.request('/users?limit=30').its('body.users').each((usuario) => {
      expect(usuario.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('CT-018 - Filtro por cor de cabelo retorna somente usuários com a cor filtrada', () => {
    cy.request('/users/filter?key=hair.color&value=Brown').its('body.users').then((usuarios) => {
      expect(usuarios.length).to.be.greaterThan(0);
      usuarios.forEach((usuario) => expect(usuario.hair.color).to.eq('Brown'));
    });
  });

  it('CT-019 - Busca por nome encontra o usuário pesquisado', () => {
    cy.request('/users/search?q=Emily').its('body.users').then((usuarios) => {
      expect(usuarios.some((u) => u.firstName === 'Emily')).to.eq(true);
    });
  });

  it('CT-020 - Carrinhos do usuário pertencem ao próprio usuário', () => {
    cy.request('/users/1/carts').its('body.carts').each((carrinho) => {
      expect(carrinho.userId).to.eq(1);
    });
  });

  it('CT-021 - Posts do usuário pertencem ao próprio usuário', () => {
    cy.request('/users/1/posts').its('body.posts').each((post) => {
      expect(post.userId).to.eq(1);
    });
  });

  it('CT-022 - Tarefas do usuário pertencem ao próprio usuário', () => {
    cy.request('/users/1/todos').its('body.todos').each((tarefa) => {
      expect(tarefa.userId).to.eq(1);
    });
  });
});
