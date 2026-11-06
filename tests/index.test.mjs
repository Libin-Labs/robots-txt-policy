import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('allows paths without a matching rule', () => {
  assert.equal(api.isAllowed('User-agent: *\nDisallow: /private', 'Bot', '/public'), true);
});
test('applies wildcard group disallow', () => {
  assert.equal(api.isAllowed('User-agent: *\nDisallow: /private', 'Bot', '/private/x'), false);
});
test('prefers longer matching path', () => {
  assert.equal(
    api.isAllowed(
      'User-agent: *\nDisallow: /private\nAllow: /private/public',
      'Bot',
      '/private/public/x',
    ),
    true,
  );
});
test('applies wildcard and terminal anchor', () => {
  assert.equal(api.isAllowed('User-agent: *\nDisallow: /*.pdf$', 'Bot', '/docs/a.pdf'), false);
  assert.equal(api.isAllowed('User-agent: *\nDisallow: /*.pdf$', 'Bot', '/docs/a.pdf/more'), true);
});
test('prefers the most specific agent group', () => {
  assert.equal(
    api.isAllowed('User-agent: *\nDisallow: /\nUser-agent: example\nAllow: /', 'ExampleBot', '/'),
    true,
  );
});
test('rejects relative paths', () => {
  assert.throws(() => api.isAllowed('User-agent: *', 'Bot', 'private'), RangeError);
});
