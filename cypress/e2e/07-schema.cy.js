const schemas = require('../../shared/schemas');
const { credenciais } = require('../../shared/dados');
const { validarSchema } = require('../../shared/validador');
const { rotular } = require('../../shared/allure');

// Valida estrutura e tipos de cada resposta com JSON Schema (AJV)
describe('Schema — estrutura e tipos das respostas', () => {
  beforeEach(() => {
    rotular('Schema', 'Schema');
  });

  const casos = [
    { id: 'CT-041', nome: 'produto', rota: '/products/1', schema: schemas.produto },
    { id: 'CT-042', nome: 'lista de produtos', rota: '/products?limit=10', schema: schemas.listaProdutos },
    { id: 'CT-043', nome: 'categorias', rota: '/products/categories', schema: schemas.categorias },
    { id: 'CT-044', nome: 'usuário', rota: '/users/1', schema: schemas.usuario },
    { id: 'CT-045', nome: 'lista de usuários', rota: '/users?limit=10', schema: schemas.listaUsuarios },
    { id: 'CT-046', nome: 'carrinho', rota: '/carts/1', schema: schemas.carrinho },
    { id: 'CT-047', nome: 'post', rota: '/posts/1', schema: schemas.post },
    { id: 'CT-048', nome: 'tarefa', rota: '/todos/1', schema: schemas.tarefa },
  ];

  casos.forEach((caso) => {
    it(`${caso.id} - Schema de ${caso.nome}`, () => {
      cy.request(caso.rota).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(validarSchema(caso.schema, body)).to.deep.eq([]);
      });
    });
  });

  it('CT-049 - Schema da resposta de login', () => {
    cy.request('POST', '/auth/login', credenciais).its('body').then((corpo) => {
      expect(validarSchema(schemas.login, corpo)).to.deep.eq([]);
    });
  });

  it('CT-050 - Schema da resposta de exclusão', () => {
    cy.request('DELETE', '/products/1').its('body').then((corpo) => {
      expect(validarSchema(schemas.exclusao, corpo)).to.deep.eq([]);
    });
  });
});
