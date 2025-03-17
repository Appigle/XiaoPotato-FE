# XiaoPotato-FE

Frontend of the XiaoPotato application

## Website

[XiaoPotato](https://zfc.xiaopotato.top)

<img src="./public/XiaoPotatoQrCode002.png" alt="XiaoPotato" width="200" height="200">

Guest Account: Guest/Guest123

### Screenshots

<img src="./public/xiaoPotatoLoginPage.png" alt="XiaoPotato Login page" height="400">
<img src="./public/xiaoPotatoIndex.png" alt="XiaoPotato Index page" height="400">

## Installation

```bash
git clone https://github.com/XiaoPotato-Team/XiaoPotato-FE.git
cd XiaoPotato-FE
pnpm install & pnpm run dev
```

Create/Modify the root/.env/.env file, add your own API_KEY

```bash
VITE_X_POTATO_BASE_URL="https://[URL]"
VITE_WEATHER_API_KEY=""
VITE_RESEND_API_KEY=""
VITE_SOCKET_URL="wss://[URL]"
```

## Cloudflare Wrangler

```bash
pnpm install -g wrangler
wrangler login
wrangler pages dev dist
```

## use puppeteer to craw the imgs from unsplash

```bash
# fisrt update .puppeteer/index.cjs crawImgsPath and than execute the command
npm run craw-img

# copy images' path and than ask AI to general the sql based on the Post table scheme, reference: src/main/resources/sql/ddl/insertPostDataAndBindUser.sql
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

### Dependencies and notes

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
- [React-xss-defence](https://www.dhiwise.com/post/react-xss-advanced-strategies-for-mitigating-security-threats)
- [dompurify](https://www.npmjs.com/package/dompurify)
- [EventBus mitt](https://github.com/developit/mitt)

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Appigle"><img src="https://avatars.githubusercontent.com/u/12708299?v=4" width="100px;" alt="Ray Chen"/><br /><sub><b>Ray Chen</b></sub></a><br /><span title="Infrastructure (Hosting, Build-Tools, etc)">🚇 💻</span></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/zi7feng"><img src="https://avatars.githubusercontent.com/u/113199068?v=4" width="100px;" alt="Ziqi Feng"/><br /><sub><b>Ziqi Feng</b></sub></a><br /><span title="Infrastructure (Hosting, Build-Tools, etc)">🚇 💻</span></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mengyaozhang888"><img src="https://avatars.githubusercontent.com/u/171214413?v=4" width="100px;" alt="Mengyao Zhang"/><br /><sub><b>Mengyao Zhang</b></sub></a><br />💻</td>
         </tr>
  </tbody>
</table>

