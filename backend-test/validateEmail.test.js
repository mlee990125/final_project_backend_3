const validateEmail = require('./validateEmail');

test('tests if test@gmail.com is a valid email', () => {
  var email = 'test@gmail.com'
  expect(validateEmail(email)).toBe(true);
});

