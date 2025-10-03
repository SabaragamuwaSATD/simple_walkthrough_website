module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:tailwindcss/recommended',
        'prettier'
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['react', 'tailwindcss'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'tailwindcss/classnames-order': 'warn',
        'tailwindcss/no-custom-classname': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};