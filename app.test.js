const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeAccountNumber, validateAccountNumber, calculateLuhnDigit, parseAccountNumbers } = require('./app');

test('normaliza espacios y guiones como números de cuenta', () => {
  assert.equal(normalizeAccountNumber('7992 7398 71'), '7992739871');
  assert.equal(normalizeAccountNumber('7-992-7398-71'), '7992739871');
});

test('rechaza caracteres no numéricos', () => {
  assert.equal(validateAccountNumber('7992a7398'), false);
  assert.equal(validateAccountNumber('7992 73-98'), true);
});

test('calcula el dígito verificador para un número base válido', () => {
  assert.equal(calculateLuhnDigit('7992739871'), 3);
});

test('separar varios números de cuenta ingresados con comas', () => {
  assert.deepEqual(parseAccountNumbers('7992 7398 71, 4111-1111-1111-1111'), ['7992739871', '4111111111111111']);
});
