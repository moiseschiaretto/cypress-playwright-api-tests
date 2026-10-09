const contratos = require('../../shared/contracts');
const { credenciais, ID_INEXISTENTE } = require('../../shared/dados');
const { validarSchema } = require('../../shared/validador');
const { rotular } = require('../../shared/allure');

// Contrato rígido: campos exatos, tipos, valores permitidos e nenhum campo extra
describe('Contrato — acordo entre a API e o consumidor', () => {
  beforeEach(() => {
    rotular('Contrato', 'Contrato');
  });

  it('CT-051 - Contrato do produto (campos exatos, sem campos extras)', () => {
    cy.request('/products/1').its('body').then((produto) => {
      expect(validarSchema(contratos.produto, produto)).to.deep.eq([]);
    });
  });

  it('CT-052 - Contrato da paginação de produtos', () => {
    cy.request('/products?limit=5').its('body').then((corpo) => {
      expect(validarSchema(contratos.paginacaoProdutos, corpo)).to.deep.eq([]);
    });
  });

  it('CT-053 - Contrato da paginação de usuários', () => {
    cy.request('/users?limit=5').its('body').then((corpo) => {
      expect(validarSchema(contratos.paginacaoUsuarios, corpo)).to.deep.eq([]);
    });
  });

  it('CT-054 - Contrato da resposta de login', () => {
    cy.request('POST', '/auth/login', credenciais).its('body').then((corpo) => {
      expect(validarSchema(contratos.login, corpo)).to.deep.eq([]);
    });
  });

  it('CT-055 - Contrato de post e de tarefa', () => {
    cy.request('/posts/1').its('body').then((post) => {
      expect(validarSchema(contratos.post, post)).to.deep.eq([]);
    });
    cy.request('/todos/1').its('body').then((tarefa) => {
      expect(validarSchema(contratos.tarefa, tarefa)).to.deep.eq([]);
    });
  });

  it('CT-056 - Status de disponibilidade dos produtos respeita os valores permitidos', () => {
    cy.request('/products?limit=0&select=availabilityStatus').its('body.products').each((produto) => {
      expect(validarSchema(contratos.produto.properties.availabilityStatus, produto.availabilityStatus)).to.deep.eq([]);
    });
  });

  it('CT-057 - Perfil (role) dos usuários respeita os valores permitidos', () => {
    cy.request('/users?limit=0&select=role').its('body.users').each((usuario) => {
      expect(validarSchema(contratos.usuarioRole, usuario)).to.deep.eq([]);
    });
  });

  it('CT-058 - Contrato de erro: recurso inexistente retorna mensagem', () => {
    cy.request({ url: `/products/${ID_INEXISTENTE}`, failOnStatusCode: false }).then(({ status, body }) => {
      expect(status).to.eq(404);
      expect(validarSchema(contratos.erro, body)).to.deep.eq([]);
    });
  });
});
