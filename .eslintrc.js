/** JavaScript Versions
 *  5 is minimum -> Last IE11
 *  6 = 2015 -> Node >8.10, iOS12+
 *  7 = 2016 -> FF78+,
 *  8 = 2017 -> Node 10.9+
 *  9 = 2018 -> Node 12.11+
 * 10 = 2019 -> Node 12.20 LTS
 * 11 = 2020 -> Node 14 LTS
 * 12 = 2021 -> Node 16
 */
/** Node.js supports (https://node.green/):
 * v07 - async/await
 * v09 - tagged template literals with invalid escape sequences,  RegExp lookbehind assertions
 * v10 - optional catch binding (no need for err param on catch), BigInt, import.meta,
 *         RegExp Unicode property escape sequences \p{...},
 *         trimStart/trimEnd, async iteration, Promise.prototype.finally,
 *         RegExp named capture groups
 * v11 - Array.prototype.{flat,flatMap}, Symbol.prototype.description
 * v12 - Promise.allSettled, globalThis, numeric separators, Object.fromEntries
 * v13 - import (modules), dynamic import(), export
 * v14 - optional chaining, Nullish Coalescing operators, String.prototype.matchAll,
 *         Intl.DisplayNames, Intl.DateTimeFormat, (Experimental: Async Local Storage, Top-Level Await, Diagnostic report),
 *         WeakReferences, private class methods
 * v15 - logical assignment operators, String.prototype.replaceAll, Promise.any, AggregateError, AbortController,
 *        Promisified setTimeout/setImmediate
 */
 module.exports = {
  env: {
      browser: false,
      commonjs: true,
      jquery: false,
      node: true,
      // es2019: true,
      'shared-node-browser': false
  },
  parserOptions: {
      // Only ESLint 6.2.0 and later support ES2020. Node.js v12+ supports some things only ratified in 2020
      'ecmaVersion': 2022,
      sourceType: 'script'
  },
  root: true,
  // globals: {
  //     Set: true, // Not sure why eslint doesn't recognise this as it is part of node.js since v0.12
  //     RED: true,
  // },
  overrides: [
      {
          files: ['*.module.js', '*.mod.js', '*.mjs'],
          parserOptions: { sourceType: 'module' },
      }
  ],
  plugins: [
      'html',     // Check scripts in HTML. https://www.npmjs.com/package/eslint-plugin-html
      'es',       // Help avoid js that is too new. https://eslint-plugin-es.mysticatea.dev/
      'jsdoc',    // JSDoc. https://www.npmjs.com/package/eslint-plugin-jsdoc
      'promise',  // Better promises. https://www.npmjs.com/package/eslint-plugin-promise
      'sonarjs',  // Detect bugs and suspicious patterns. https://github.com/SonarSource/eslint-plugin-sonarjs
      // 'prettier', // https://www.npmjs.com/package/eslint-plugin-prettier
      // 'eslint-plugin-n', // loads itself from extends, no need to manually load
  ],
  extends: [
      'standard',
      // 'eslint:recommended',
      'plugin:es/restrict-to-es2020',
      'plugin:jsdoc/recommended',
      'plugin:promise/recommended',
      'plugin:sonarjs/recommended',
      // 'plugin:prettier/recommended',
      // The n plugin reads the min. node.js version from package.json and error's any ES features not available in that version.
      'plugin:n/recommended',
  ],
  // settings: {
  //     jsdoc: {
  //         mode: 'permissive'
  //     }
  // },
  rules: {
      'n/no-process-exit': 'error',

      // remove once min engines moves to node.js v14+
      // 'es/no-optional-chaining': 'error',
      // 'es/no-dynamic-import': 'error',
      // 'es/no-nullish-coalescing-operators': 'error',

      // remove once min engines moves to node.js v15+
      'es/no-logical-assignment-operators': 'error',
      'es/no-promise-any': 'error',
      'es/no-numeric-separators': 'error',

      // Tidy up some jsdoc oddities
      'jsdoc/multiline-blocks': 0,
      'jsdoc/newline-after-description': 0,
      'jsdoc/no-multi-asterisks': 0,
      'jsdoc/tag-lines': 0,
      'jsdoc/valid-types': 0, // Rubbish, fails on common type configs
      'jsdoc/no-undefined-types': 0, // ['error'|'warn', {'definedTypes':['Promise']}],

      // Try to keep code complexity in functions to a minimum
      'sonarjs/cognitive-complexity': ['error', 60],  // default is 15! Need to try and improve this :-)

      // Make Standard less annoying
      'brace-style': 'off',     // You should only use one-true-brace style but sometimes we want to compress things a bit.
      'comma-dangle': 'off',    // Lack of dangles wastes soo much time correcting lists
      'dot-notation': 'off',    // Turn off to allow for tslint's brain-dead treatment of expando objects in JS
      'indent': ['error', 4, { 'SwitchCase': 1 }],   // Standard wants 2, I like 4
      'space-before-function-paren': 'off', // No, don't need space between fn and arg!
      'no-multi-spaces': 'off', // Readability is more important than size (reduce size using uglify)
      'object-shorthand': ['error', 'consistent'],
      'padded-blocks': 'off',   // Sometimes you just need some space! See above.
      'space-in-parens': 'off', // Sometimes you just need some space!
      'spaced-comment': ['error', 'always', {
          'markers': ['html', '#region', '#endregion']
      }],
      'quote-props': 'off',     // Sometimes it is necessary and then much nicer to be able to quote things that don't need it.
  }
}
