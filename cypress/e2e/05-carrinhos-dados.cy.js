const { novoCarrinho } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

const somar = (lista, campo) => lista.reduce((total, item) => total + item[campo], 0);

describe('Carrinhos — regras de cálculo', () => {
  beforeEach(() => {
    rotular('Carrinhos', 'Dados');
  });

  it('CT-031 - Total de produtos e de itens do carrinho conferem com a lista', () => {
    cy.request('/carts/1').its('body').then((carrinho) => {
      expect(carrinho.totalProducts).to.eq(carrinho.products.length);
      expect(carrinho.totalQuantity).to.eq(somar(carrinho.products, 'quantity'));
    });
  });

  it('CT-032 - Total de cada item é preço vezes quantidade', () => {
    cy.request('/carts/1').its('body.products').each((item) => {
      expect(item.total).to.be.closeTo(item.price * item.quantity, 0.05);
    });
  });

  it('CT-033 - Total do carrinho é a soma dos totais dos itens', () => {
    cy.request('/carts/1').its('body').then((carrinho) => {
      expect(carrinho.total).to.be.closeTo(somar(carrinho.products, 'total'), 0.05);
    });
  });

  it('CT-034 - Total com desconto não ultrapassa o total sem desconto', () => {
    cy.request('/carts?limit=10').its('body.carts').each((carrinho) => {
      expect(carrinho.discountedTotal).to.be.at.most(carrinho.total);
    });
  });

  it('CT-035 - Incluir carrinho calcula quantidade total e mantém o usuário', () => {
    cy.request('POST', '/carts/add', novoCarrinho).then(({ status, body }) => {
      expect(status).to.be.oneOf([200, 201]);
      expect(body.userId).to.eq(novoCarrinho.userId);
      expect(body.totalProducts).to.eq(novoCarrinho.products.length);
      expect(body.totalQuantity).to.eq(somar(novoCarrinho.products, 'quantity'));
    });
  });
});
