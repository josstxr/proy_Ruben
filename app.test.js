const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeAccountNumber, validateAccountNumber, calculateLuhnDigit, checkCardExistence } = require('./app');

test('normaliza espacios y guiones como números de cuenta', () => {
  assert.equal(normalizeAccountNumber('7992 7398 71'), '7992739871');
  assert.equal(normalizeAccountNumber('7-992-7398-71'), '7992739871');
});

test('rechaza caracteres no numéricos', () => {
  assert.equal(validateAccountNumber('7992a7398'), false);
  assert.equal(validateAccountNumber('7992 73-98'), true);
});

test('calcula el dígito verificador para una tarjeta válida', () => {
  assert.equal(calculateLuhnDigit('4111111111111111'), 3);
});

test('detecta si una tarjeta parece existir', () => {
  assert.equal(checkCardExistence('4111111111111111'), true);
  assert.equal(checkCardExistence('4111111111111112'), false);
  assert.equal(checkCardExistence('0000000000000000'), false);
});
