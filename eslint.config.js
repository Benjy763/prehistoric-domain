// eslint.config.js
const js = require('@eslint/js');
module.exports = [
  {
    ignores: [
      '**/node_modules/*',
      '**/dist/*',
      '**/build/*',
      '**/config/*',
      '*.min.js',
      '**/assets/',
      '**/vendors/'
    ]
  },
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  }
];
