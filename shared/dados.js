// Massa de teste e valores de referência da API DummyJSON.
// Compartilhado pelo Cypress e pelo Playwright.

const API_URL = 'https://dummyjson.com';

// Usuário de exemplo publicado na documentação da DummyJSON
const credenciais = {
  username: 'emilys',
  password: 'emilyspass',
};

const produtoReferencia = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  category: 'beauty',
};

const usuarioReferencia = {
  id: 1,
  firstName: 'Emily',
  username: 'emilys',
  role: 'admin',
};

const novoProduto = {
  title: 'Produto de Teste QA',
  price: 199.9,
  category: 'beauty',
  stock: 10,
};

const novoCarrinho = {
  userId: 1,
  products: [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ],
};

// Valores aceitos pela API (usados nos testes de contrato)
const enums = {
  availabilityStatus: ['In Stock', 'Low Stock', 'Out of Stock'],
  role: ['admin', 'moderator', 'user'],
};

// Tempo máximo de resposta aceito no teste de desempenho básico (ms)
const TEMPO_MAXIMO_MS = 2000;

const ID_INEXISTENTE = 999999;

module.exports = {
  API_URL,
  credenciais,
  produtoReferencia,
  usuarioReferencia,
  novoProduto,
  novoCarrinho,
  enums,
  TEMPO_MAXIMO_MS,
  ID_INEXISTENTE,
};
