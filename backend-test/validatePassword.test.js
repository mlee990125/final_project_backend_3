const validatePassword = require('./validatePassword');

test('tests if "1qief9" is a allowed password', () => {
  var password = "1qief9"
  expect(validatePassword("1qief9")).toBe(false);
});