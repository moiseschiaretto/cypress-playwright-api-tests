// Contratos: definem o ACORDO entre a API (provedor) e quem a consome.
// São rígidos: campos obrigatórios exatos, tipos, valores permitidos (enum)
// e NENHUM campo extra (additionalProperties: false).
// Se a API remover, renomear ou adicionar um campo, o teste de contrato falha.

const { enums } = require('../dados');

const produto = {
  type: 'object',
  additionalProperties: false,
  required: [
    'id', 'title', 'description', 'category', 'price', 'discountPercentage', 'rating', 'stock',
    'tags', 'sku', 'weight', 'dimensions', 'warrantyInformation', 'shippingInformation',
    'availabilityStatus', 'reviews', 'returnPolicy', 'minimumOrderQuantity', 'meta', 'images', 'thumbnail',
  ],
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string' },
    price: { type: 'number' },
    discountPercentage: { type: 'number' },
    rating: { type: 'number' },
    stock: { type: 'integer' },
    tags: { type: 'array', items: { type: 'string' } },
    brand: { type: 'string' },
    sku: { type: 'string' },
    weight: { type: 'number' },
    dimensions: {
      type: 'object',
      additionalProperties: false,
      required: ['width', 'height', 'depth'],
      properties: { width: { type: 'number' }, height: { type: 'number' }, depth: { type: 'number' } },
    },
    warrantyInformation: { type: 'string' },
    shippingInformation: { type: 'string' },
    availabilityStatus: { enum: enums.availabilityStatus },
    reviews: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['rating', 'comment', 'date', 'reviewerName', 'reviewerEmail'],
        properties: {
          rating: { type: 'number' },
          comment: { type: 'string' },
          date: { type: 'string' },
          reviewerName: { type: 'string' },
          reviewerEmail: { type: 'string' },
        },
      },
    },
    returnPolicy: { type: 'string' },
    minimumOrderQuantity: { type: 'integer' },
    meta: {
      type: 'object',
      additionalProperties: false,
      required: ['createdAt', 'updatedAt', 'barcode', 'qrCode'],
      properties: {
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        barcode: { type: 'string' },
        qrCode: { type: 'string' },
      },
    },
    images: { type: 'array', items: { type: 'string' } },
    thumbnail: { type: 'string' },
  },
};

const paginacao = (campo) => ({
  type: 'object',
  additionalProperties: false,
  required: [campo, 'total', 'skip', 'limit'],
  properties: {
    [campo]: { type: 'array' },
    total: { type: 'integer' },
    skip: { type: 'integer' },
    limit: { type: 'integer' },
  },
});

const login = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'username', 'email', 'firstName', 'lastName', 'gender', 'image', 'accessToken', 'refreshToken'],
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    image: { type: 'string' },
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  },
};

const tarefa = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'todo', 'completed', 'userId'],
  properties: {
    id: { type: 'integer' },
    todo: { type: 'string' },
    completed: { type: 'boolean' },
    userId: { type: 'integer' },
  },
};

const post = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'body', 'tags', 'reactions', 'views', 'userId'],
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    body: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    reactions: {
      type: 'object',
      additionalProperties: false,
      required: ['likes', 'dislikes'],
      properties: { likes: { type: 'integer' }, dislikes: { type: 'integer' } },
    },
    views: { type: 'integer' },
    userId: { type: 'integer' },
  },
};

// Contrato de erro: toda resposta de erro traz uma mensagem em texto
const erro = {
  type: 'object',
  required: ['message'],
  properties: { message: { type: 'string', minLength: 1 } },
};

const usuarioRole = {
  type: 'object',
  required: ['role'],
  properties: { role: { enum: enums.role } },
};

module.exports = {
  produto,
  paginacaoProdutos: paginacao('products'),
  paginacaoUsuarios: paginacao('users'),
  login,
  tarefa,
  post,
  erro,
  usuarioRole,
};
