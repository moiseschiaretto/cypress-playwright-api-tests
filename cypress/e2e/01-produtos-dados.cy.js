const { produtoReferencia } = require('../../shared/dados');
const { rotular } = require('../../shared/allure');

describe('Produtos — validação de dados', () => {
  beforeEach(() => {
    rotular('Produtos', 'Dados');
  });

  it('CT-001 - Consultar produto por id retorna o produto correto', () => {
    cy.request(`/products/${produtoReferencia.id}`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.id).to.eq(produtoReferencia.id);
      expect(body.title).to.eq(produtoReferencia.title);
      expect(body.category).to.eq(produtoReferencia.category);
    });
  });

  it('CT-002 - Produto possui preço, desconto, avaliação e estoque em faixas válidas', () => {
    cy.request('/products/1').its('body').then((produto) => {
      expect(produto.price).to.be.greaterThan(0);
      expect(produto.discountPercentage).to.be.within(0, 100);
      expect(produto.rating).to.be.within(0, 5);
      expect(produto.stock).to.be.at.least(0);
    });
  });

  it('CT-003 - Listagem padrão retorna 30 produtos a partir do início', () => {
    cy.request('/products').its('body').then((corpo) => {
      expect(corpo.limit).to.eq(30);
      expect(corpo.skip).to.eq(0);
      expect(corpo.products).to.have.length(30);
      expect(corpo.total).to.be.at.least(30);
    });
  });

  it('CT-004 - Paginação com limit e skip retorna a página correta', () => {
    cy.request('/products?limit=10&skip=10').its('body').then((corpo) => {
      expect(corpo.limit).to.eq(10);
      expect(corpo.skip).to.eq(10);
      expect(corpo.products).to.have.length(10);
      expect(corpo.products[0].id).to.eq(11);
    });
  });

  it('CT-005 - Parâmetro select retorna somente os campos solicitados', () => {
    cy.request('/products?limit=5&select=title,price').its('body.products').each((produto) => {
      expect(Object.keys(produto).sort()).to.deep.eq(['id', 'price', 'title']);
    });
  });

  it('CT-006 - Ordenação por preço crescente', () => {
    cy.request('/products?sortBy=price&order=asc&limit=20').its('body.products').then((produtos) => {
      const precos = produtos.map((p) => p.price);
      expect(precos).to.deep.eq([...precos].sort((a, b) => a - b));
    });
  });

  it('CT-007 - Ordenação por preço decrescente', () => {
    cy.request('/products?sortBy=price&order=desc&limit=20').its('body.products').then((produtos) => {
      const precos = produtos.map((p) => p.price);
      expect(precos).to.deep.eq([...precos].sort((a, b) => b - a));
    });
  });

  it('CT-008 - Busca por termo retorna resultados coerentes com o total', () => {
    cy.request('/products/search?q=phone').its('body').then((corpo) => {
      expect(corpo.total).to.be.greaterThan(0);
      expect(corpo.products.length).to.eq(Math.min(corpo.total, corpo.limit));
    });
  });

  it('CT-009 - Produtos por categoria pertencem somente à categoria pesquisada', () => {
    cy.request('/products/category/smartphones').its('body.products').then((produtos) => {
      expect(produtos.length).to.be.greaterThan(0);
      produtos.forEach((produto) => expect(produto.category).to.eq('smartphones'));
    });
  });

  it('CT-010 - Lista de categorias contém categorias conhecidas', () => {
    cy.request('/products/category-list').its('body').then((categorias) => {
      expect(categorias).to.be.an('array').and.include.members(['beauty', 'smartphones']);
      categorias.forEach((categoria) => expect(categoria).to.be.a('string'));
    });
  });

  it('CT-011 - URL de cada categoria aponta para o próprio slug', () => {
    cy.request('/products/categories').its('body').each((categoria) => {
      expect(categoria.url).to.contain(`/products/category/${categoria.slug}`);
    });
  });
});
