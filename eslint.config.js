// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended, // règles JS de base
  {
    files: ["**/*.js", "**/*.jsx"], // extensions ciblées
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest", // syntaxe moderne
        sourceType: "module",  // modules ES
        ecmaFeatures: {
          jsx: true, // indispensable pour que ESLint comprenne le JSX
        },
      },
      globals: {
        browser: true,
        node: true,
        document: true, // évite l'erreur "document is not defined"
        window: true,   // évite l'erreur "window is not defined"
        setTimeout: true,
        clearTimeout: true,
        fetch: true,
        clearInterval: true,
        setInterval: true,
        console: true, // évite l'erreur "console is not defined"
        navigator: true, // évite l'erreur "navigator is not defined"
        React: true, // évite l'erreur "React is not defined" dans les fichiers JSX
        StrictMode: true, // évite l'erreur "StrictMode is not defined"
        App: true, // évite l'erreur "App is not defined" dans les tests
        localStorage: true, // évite l'erreur "localStorage is not defined"
        sessionStorage: true, // évite l'erreur "sessionStorage is not defined"
        
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      prettier,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // inutile depuis React 17+
      "react-hooks/rules-of-hooks": "error", // vérifie l’usage correct des hooks
      "react-hooks/exhaustive-deps": "warn", // avertit si deps manquants
      "no-unused-vars": ["warn", { "varsIgnorePattern": "React|StrictMode|App" }], // ignore ces faux positifs
      "prettier/prettier": "error", // force le style Prettier
    },
    settings: {
      react: {
        version: "detect", // détecte automatiquement la version de React
      },
    },
  },
];
