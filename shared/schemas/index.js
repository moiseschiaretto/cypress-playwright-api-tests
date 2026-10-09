// JSON Schemas: validam ESTRUTURA e TIPOS das respostas.
// São flexíveis: aceitam campos extras (additionalProperties liberado).

const dimensoes = {
  type: 'object',
  required: ['width', 'height', 'depth'],
  properties: {
    width: { type: 'number' },
    height: { type: 'number' },
    depth: { type: 'number' },
  },
};

const avaliacao = {
  type: 'object',
  required: ['rating', 'comment', 'date', 'reviewerName', 'reviewerEmail'],
  properties: {
    rating: { type: 'number', minimum: 0, maximum: 5 },
    comment: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    reviewerName: { type: 'string' },
    reviewerEmail: { type: 'string', format: 'email' },
  },
};

const produto = {
  type: 'object',
  required: ['id', 'title', 'description', 'category', 'price', 'discountPercentage', 'rating', 'stock', 'tags', 'images', 'thumbnail'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    category: { type: 'string' },
    price: { type: 'number', exclusiveMinimum: 0 },
    discountPercentage: { type: 'number', minimum: 0, maximum: 100 },
    rating: { type: 'number', minimum: 0, maximum: 5 },
    stock: { type: 'integer', minimum: 0 },
    tags: { type: 'array', items: { type: 'string' } },
    brand: { type: 'string' },
    sku: { type: 'string' },
    weight: { type: 'number' },
    dimensions: dimensoes,
    reviews: { type: 'array', items: avaliacao },
    images: { type: 'array', items: { type: 'string', format: 'uri' } },
    thumbnail: { type: 'string', format: 'uri' },
  },
};

const listaPaginada = (campo, item) => ({
  type: 'object',
  required: [campo, 'total', 'skip', 'limit'],
  properties: {
    [campo]: { type: 'array', items: item },
    total: { type: 'integer', minimum: 0 },
    skip: { type: 'integer', minimum: 0 },
    limit: { type: 'integer', minimum: 0 },
  },
});

const endereco = {
  type: 'object',
  required: ['address', 'city', 'state', 'postalCode', 'country'],
  properties: {
    address: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    postalCode: { type: 'string' },
    country: { type: 'string' },
    coordinates: {
      type: 'object',
      required: ['lat', 'lng'],
      properties: { lat: { type: 'number' }, lng: { type: 'number' } },
    },
  },
};

const usuario = {
  type: 'object',
  required: ['id', 'firstName', 'lastName', 'age', 'gender', 'email', 'username', 'birthDate', 'role', 'address', 'company'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    age: { type: 'integer', minimum: 0 },
    gender: { type: 'string' },
    email: { type: 'string', format: 'email' },
    username: { type: 'string' },
    birthDate: { type: 'string' },
    role: { type: 'string' },
    address: endereco,
    company: {
      type: 'object',
      required: ['name', 'department', 'title'],
      properties: {
        name: { type: 'string' },
        department: { type: 'string' },
        title: { type: 'string' },
        address: endereco,
      },
    },
  },
};

const itemCarrinho = {
  type: 'object',
  required: ['id', 'title', 'price', 'quantity', 'total'],
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    price: { type: 'number' },
    quantity: { type: 'integer', minimum: 1 },
    total: { type: 'number' },
    discountPercentage: { type: 'number' },
    thumbnail: { type: 'string', format: 'uri' },
  },
};

const carrinho = {
  type: 'object',
  required: ['id', 'products', 'total', 'discountedTotal', 'userId', 'totalProducts', 'totalQuantity'],
  properties: {
    id: { type: 'integer' },
    products: { type: 'array', items: itemCarrinho },
    total: { type: 'number' },
    discountedTotal: { type: 'number' },
    userId: { type: 'integer' },
    totalProducts: { type: 'integer' },
    totalQuantity: { type: 'integer' },
  },
};

const post = {
  type: 'object',
  required: ['id', 'title', 'body', 'tags', 'reactions', 'views', 'userId'],
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    body: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    reactions: {
      type: 'object',
      required: ['likes', 'dislikes'],
      properties: { likes: { type: 'integer', minimum: 0 }, dislikes: { type: 'integer', minimum: 0 } },
    },
    views: { type: 'integer', minimum: 0 },
    userId: { type: 'integer' },
  },
};

const comentario = {
  type: 'object',
  required: ['id', 'body', 'postId', 'user'],
  properties: {
    id: { type: 'integer' },
    body: { type: 'string' },
    postId: { type: 'integer' },
    likes: { type: 'integer' },
    user: {
      type: 'object',
      required: ['id', 'username', 'fullName'],
      properties: { id: { type: 'integer' }, username: { type: 'string' }, fullName: { type: 'string' } },
    },
  },
};

const tarefa = {
  type: 'object',
  required: ['id', 'todo', 'completed', 'userId'],
  properties: {
    id: { type: 'integer' },
    todo: { type: 'string' },
    completed: { type: 'boolean' },
    userId: { type: 'integer' },
  },
};

const login = {
  type: 'object',
  required: ['id', 'username', 'email', 'firstName', 'lastName', 'gender', 'image', 'accessToken', 'refreshToken'],
  properties: {
    id: { type: 'integer' },
    username: { type: 'string' },
    email: { type: 'string', format: 'email' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    image: { type: 'string', format: 'uri' },
    accessToken: { type: 'string', pattern: '^[\\w-]+\\.[\\w-]+\\.[\\w-]+$' },
    refreshToken: { type: 'string', pattern: '^[\\w-]+\\.[\\w-]+\\.[\\w-]+$' },
  },
};

const categoria = {
  type: 'object',
  required: ['slug', 'name', 'url'],
  properties: {
    slug: { type: 'string' },
    name: { type: 'string' },
    url: { type: 'string', format: 'uri' },
  },
};

const exclusao = {
  type: 'object',
  required: ['id', 'isDeleted', 'deletedOn'],
  properties: {
    id: { type: 'integer' },
    isDeleted: { const: true },
    deletedOn: { type: 'string', format: 'date-time' },
  },
};

module.exports = {
  produto,
  listaProdutos: listaPaginada('products', produto),
  usuario,
  listaUsuarios: listaPaginada('users', usuario),
  carrinho,
  post,
  comentario,
  tarefa,
  login,
  categorias: { type: 'array', minItems: 1, items: categoria },
  exclusao,
};
