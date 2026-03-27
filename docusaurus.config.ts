import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

module.exports = {
  plugins: [
    [
      'posthog-docusaurus',
      {
        apiKey: 'phc_U1WrxBRZchT9vdlYTVQnTsJs8i49VRRTPvXzIjGA7Cd',
        appUrl: 'https://us.i.posthog.com',
        enableInDevelopment: false,
      },
    ],
  ],
}


const config: Config = {
  title: 'Builders International Docs',
  tagline: 'Internal Project Documentation',
  favicon: 'img/favicon.ico',

  future: { v4: true },
  url: 'https://api.buildersintl.org',
  baseUrl: '/',

  organizationName: 'egod21',
  projectName: 'builders-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          routeBasePath: '/', // Serve docs at root!
        },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Builders International Docs',
      logo: {
        alt: 'Builders International Logo',
        src: 'https://i.imgur.com/m0UB843.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© ${new Date().getFullYear()} Builders International`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
