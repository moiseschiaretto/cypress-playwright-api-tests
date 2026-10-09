// Validação de JSON Schema com AJV (usado nos testes de schema e de contrato)
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Retorna a lista de erros (vazia quando o JSON respeita o schema)
function validarSchema(schema, dados) {
  const validar = ajv.compile(schema);
  const valido = validar(dados);
  if (valido) return [];
  return validar.errors.map((e) => `${e.instancePath || '(raiz)'} ${e.message}`);
}

// Decodifica o payload de um token JWT (sem validar a assinatura)
function decodificarJwt(token) {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = typeof atob === 'function'
    ? decodeURIComponent(escape(atob(base64)))
    : Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(json);
}

module.exports = { validarSchema, decodificarJwt };
