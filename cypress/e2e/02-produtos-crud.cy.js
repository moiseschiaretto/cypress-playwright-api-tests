const { novoProduto } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

// Na DummyJSON, inclusão, alteração e exclusão são simuladas: a API responde
// como se gravasse, mas não altera os dados no servidor.
describe('Produtos — inclusão, alteração e exclusão (CRUD)', () => {
  beforeEach(() => {
    rotular('Produtos', 'CRUD');
  });

  it('CT-012 - Incluir produto retorna o produto criado com novo id', () => {
    cy.request('POST', '/products/add', novoProduto).then(({ status, body }) => {
      expect(status).to.be.oneOf([200, 201]);
      expect(body.id).to.be.greaterThan(0);
      expect(body.title).to.eq(novoProduto.title);
      expect(body.price).to.eq(novoProduto.price);
    });
  });

  it('CT-013 - Alterar produto com PUT atualiza o título', () => {
    cy.request('PUT', '/products/1', { title: 'Titulo alterado via PUT' }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.id).to.eq(1);
      expect(body.title).to.eq('Titulo alterado via PUT');
    });
  });

  it('CT-014 - Alterar produto com PATCH atualiza somente o preço', () => {
    cy.request('PATCH', '/products/1', { price: 12.34 }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.id).to.eq(1);
      expect(body.price).to.eq(12.34);
    });
  });

  it('CT-015 - Excluir produto retorna isDeleted e data de exclusão', () => {
    cy.request('DELETE', '/products/1').then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.isDeleted).to.eq(true);
      expect(Number.isNaN(Date.parse(body.deletedOn))).to.eq(false);
    });
  });
});
