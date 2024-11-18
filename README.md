# XiaoPotato-FE

Frontend of the XiaoPotato application

## Installation

```bash
git clone https://github.com/XiaoPotato-Team/XiaoPotato-FE.git
cd XiaoPotato-FE
pnpm install & pnpm run dev
```

## Cloudflare Wrangler

```bash
pnpm install -g wrangler
wrangler login
wrangler pages dev dist
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## dependencies list

### UI Library

- [@material-tailwind/react@beta](https://www.material-tailwind.com/docs/v3/react/badge)
- option: [daisyui](https://daisyui.com/components/toast/)
- option: [magicui](https://magicui.design/docs/components/tweet-card)
- option: [pagedone](https://pagedone.io/docs/modal)
- option: [flowbite-react](https://flowbite-react.com/docs/getting-started/introduction)
- [Top 5 Tailwind Component Libraries: Apestein 2023](https://dev.to/apestein/top-5-tailwind-component-libraries-m0c)

### React

- [React-Hook-Form](https://react-hook-form.com/)
- [React-Query](https://react-query.tanstack.com/)
- [React-Table](https://react-table.tanstack.com/)
- [React-Select](https://react-select.com/)
- [React-Icons](https://react-icons.github.io/react-icons/)
- [React-Router](https://reactrouter.com/)
- [React-Spinners](https://www.npmjs.com/package/react-spinners)
- [React-Toastify](https://fkhadra.github.io/react-toastify/introduction/)
- [React-Datepicker](https://reactdatepicker.com/)
- [React-Dropzone](https://react-dropzone.js.org/)
- [React-Aria](https://react-spectrum.adobe.com/react-aria/)
- [React-Hotkeys-Hook](https://react-hotkeys-hook.vercel.app/docs/intro)
- [React-Textarea-Autosize](https://github.com/Andarist/react-textarea-autosize)
- [React-hooks-ts](https://usehooks-ts.com/react-hook/use-media-query)
- [React-email](https://react.email/docs/integrations/resend)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
