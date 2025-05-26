import globals from "globals";
// import pluginJs from "@eslint/js"; // Inte behövs om inga @eslint/js regler används
import pluginReact from "eslint-plugin-react"; // Behövs för att kunna definiera 'files' och 'settings' för React
import pluginImport from "eslint-plugin-import"; // Absolut nödvändig för 'import/no-unresolved'

// Dessa behövs för att __dirname ska fungera i ESM
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    // Scanna alla relevanta filer (JS, JSX, TS, TSX)
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],

    languageOptions: {
      parserOptions: {
        // Krävs för JSX-syntax i React och modern JS
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      // Globala variabler som t.ex. 'window', 'document' för webbläsaren
      globals: {
        ...globals.browser,
        // ...globals.node, // Kommentera ut om du bara kör frontend-kod
      },
    },

    settings: {
      // Upptäcker automatiskt din React-version
      react: {
        version: "detect",
      },
      // Viktigt: Konfigurera import-resolver om du har aliasing i Vite (t.ex. '@' för './src').
      // Om du inte har aliasing, kan du ta bort 'import/resolver' helt.
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        // Exempel på alias-konfiguration för Vite:
        // "alias": {
        //   "map": [
        //     ["@", "./src"] // Byt ut "@" och "./src" till dina faktiska alias
        //   ],
        //   "extensions": [".js", ".jsx", ".ts", ".tsx"]
        // }
      },
    },

    // Deklarerar vilka plugins som används i denna konfiguration
    plugins: {
      react: pluginReact,
      import: pluginImport, // Nödvändig för 'import/no-unresolved'
    },

    // Endast den viktigaste regeln för ditt problem
    rules: {
      // Kontrollerar att importerade moduler existerar och att deras sökvägar
      // matchar exakt (skiftlägeskänsligt). Detta fångar fel mellan Windows och Linux.
      "import/no-unresolved": [
        "error", // Rapportera som fel, vilket kan bryta bygget (du kan ändra till "warn" om du bara vill ha en varning)
        {
          caseSensitive: true, // DENNA ÄR KRITISK: Tvingar skiftlägeskänslighet
          // Ignorera vissa filtyper (bilder, CSS) som Vite hanterar,
          // då de ofta inte är "moduler" i den traditionella meningen för ESLint-pluginet.
          ignore: ["\\.(png|jpe?g|gif|svg|webp)$", "\\.(css|scss|less)$"],
        },
      ],

      // Alla andra regler är borttagna eller kommenterade ut för att minimera störningar
      // "no-unused-vars": "off",
      // "no-console": "off",
      // "react/react-in-jsx-scope": "off",
      // "react/jsx-uses-react": "off",
      // ...pluginJs.configs.recommended.rules,
      // ...pluginReact.configs.recommended.rules,
    },
  },
];





// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginReact from "eslint-plugin-react";
// import pluginImport from "eslint-plugin-import";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default [
//   {
//     files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
//     // språkrelaterade inställningar måste vara under languageOptions
//     languageOptions: {
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//         ecmaVersion: "latest",
//         sourceType: "module",
//       },
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//       },
//     },
//     settings: {
//       react: {
//         version: "detect",
//       },
//       // Om du har aliasing i Vite (t.ex. '@' för './src'),
//       // kan du behöva konfigurera 'import/resolver' här.
//       // Annars kan denna del tas bort.
//       "import/resolver": {
//         node: {
//           extensions: [".js", ".jsx", ".ts", ".tsx"],
//         },
//         // Om du använder Vite-aliasing, lägg till detta:
//         // "alias": {
//         //   "map": [
//         //     ["@", "./src"] // Exempel: om du har alias @ till ./src
//         //   ],
//         //   "extensions": [".js", ".jsx", ".ts", ".tsx"]
//         // }
//       },
//     },
//     // Lägg till 'plugins' som ett separat objekt
//     plugins: {
//       react: pluginReact,
//       import: pluginImport,
//     },
//     rules: {
//       // Sprid ut reglerna från de rekommenderade konfigurationerna här
//       // Observera att vi nu sprider ut '.rules' egenskapen, inte hela objektet.
//       ...pluginJs.configs.recommended.rules,
//       ...pluginReact.configs.recommended.rules, // Specifika React-regler

//       // Den viktiga regeln för skiftlägeskänsliga imports
//       "import/no-unresolved": [
//         "error",
//         {
//           caseSensitive: true,
//           ignore: ["\\.(png|jpe?g|gif|svg|webp)$", "\\.(css|scss|less)$"],
//         },
//       ],

//       // Ytterligare regler eller åsidosättningar
//       "react/react-in-jsx-scope": "off", // För React 17+ behöver du inte importera React i varje fil
//       "react/jsx-uses-react": "off", // Samma som ovan
//       "no-unused-vars": "warn", // Varning för oanvända variabler
//       "no-console": ["warn", { allow: ["warn", "error"] }], // Varning för console.log
//     },
//   },
//   // Du kan lägga till ytterligare konfigurationsobjekt här
//   // till exempel för TypeScript-specifika regler, testfiler, etc.
// ];