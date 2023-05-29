module.exports = {
  extends: './.config/.eslintrc',
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
  },
};
