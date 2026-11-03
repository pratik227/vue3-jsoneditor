import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, postcssIsolateStyles, type DefaultTheme } from 'vitepress'
import UnoCSS from 'unocss/vite'
import llmstxt from 'vitepress-plugin-llms'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const solar = require('@iconify-json/solar/icons.json')

const SITE = 'https://v3-jsoneditor.netlify.app'
const REPO = 'https://github.com/pratik227/vue3-jsoneditor'
const SPONSOR = 'https://github.com/sponsors/pratik227'
const DESCRIPTION =
  'A Vue 3 component for viewing, editing, formatting and validating JSON — tree, code, form, text and view modes, JSON Schema, themes, fullscreen and SSR-safe.'

/** Library version, read from the root package.json (falls back gracefully). */
function libVersion(): string {
  try {
    return JSON.parse(readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8')).version
  } catch {
    return 'latest'
  }
}
const version = libVersion()

/** Inline a Solar icon as an SVG string (used for social links). */
function solarSvg(name: string): string {
  const data = getIconData(solar, name)
  if (!data) throw new Error(`[docs] Unknown Solar icon: ${name}`)
  const { attributes, body } = iconToSVG(data, { height: '1.2em' })
  return iconToHTML(replaceIDs(body), attributes)
}

const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Usage', link: '/guide/usage' },
      { text: 'Validation', link: '/guide/validation' },
      { text: 'Theming', link: '/guide/theming' },
      { text: 'Fullscreen', link: '/guide/fullscreen' },
      { text: 'SSR & Nuxt', link: '/guide/ssr' },
      { text: 'Migration', link: '/guide/migration' },
    ],
  },
  {
    text: 'API Reference',
    items: [
      { text: 'Props', link: '/api/props' },
      { text: 'Events', link: '/api/events' },
      { text: 'Methods', link: '/api/methods' },
    ],
  },
  {
    text: 'Examples',
    items: [
      { text: 'Overview', link: '/examples/' },
      { text: 'Basic', link: '/examples/basic' },
      { text: 'Read-only', link: '/examples/read-only' },
      { text: 'Form mode', link: '/examples/form-mode' },
      { text: 'JSON Schema', link: '/examples/json-schema' },
      { text: 'Custom theme', link: '/examples/custom-theme' },
      { text: 'Large JSON', link: '/examples/large-json' },
      { text: 'Custom toolbar', link: '/examples/custom-toolbar' },
    ],
  },
  {
    text: 'AI',
    items: [
      { text: 'Use with AI', link: '/ai/' },
    ],
  },
]

export default defineConfig({
  lang: 'en-US',
  title: 'v3-jsoneditor',
  description: DESCRIPTION,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: SITE },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0a0a0a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'v3-jsoneditor' }],
    ['meta', { property: 'og:title', content: 'v3-jsoneditor — The JSON editor for Vue 3' }],
    ['meta', { property: 'og:description', content: DESCRIPTION }],
    ['meta', { property: 'og:url', content: SITE }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
      },
    ],
  ],

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },

  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg', width: 24, height: 24, alt: '' },

    nav: [
      { text: 'Docs', link: '/guide/introduction', activeMatch: '^/guide/' },
      { text: 'API Reference', link: '/api/props', activeMatch: '^/api/' },
      { text: 'Examples', link: '/examples/', activeMatch: '^/examples/' },
      { text: 'Playground', link: '/playground' },
      { text: 'Use with AI', link: '/ai/', activeMatch: '^/ai/' },
      {
        text: `v${version}`.replace(/^vlatest$/, 'latest'),
        items: [
          { text: 'Changelog', link: `${REPO}/releases` },
          { text: 'npm package', link: 'https://www.npmjs.com/package/v3-jsoneditor' },
          { text: 'Report an issue', link: `${REPO}/issues` },
        ],
      },
    ],

    // One shared sidebar (a single array also keeps llms.txt from listing it once per section).
    sidebar,

    socialLinks: [
      { icon: 'github', link: REPO, ariaLabel: 'GitHub repository' },
      { icon: { svg: solarSvg('hand-heart-linear') }, link: SPONSOR, ariaLabel: 'Sponsor on GitHub' },
    ],

    editLink: {
      pattern: `${REPO}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },

    search: { provider: 'local' },

    outline: { level: [2, 3] },

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© Pratik Patel',
    },
  },

  vite: {
    plugins: [
      UnoCSS({ configFile: path.resolve(__dirname, 'uno.config.ts') }),
      groupIconVitePlugin(),
      llmstxt({
        domain: SITE,
        description: 'The JSON editor component for Vue 3',
        details: DESCRIPTION,
        // Interactive-only pages: nothing useful for an LLM there.
        ignoreFiles: ['index.md', 'playground.md'],
      }),
    ],
    css: {
      postcss: {
        // Keep VitePress prose styles (.vp-doc table/td/tr, links, lists…) out of every live
        // editor automatically, plus anything wrapped in `.vp-raw`. Without this the
        // .vp-doc table rules break jsoneditor's table-based tree view.
        plugins: [
          postcssIsolateStyles({
            includeFiles: [/vp-doc\.css/],
            prefix: ':not(:where(.vp-raw, .vp-raw *, .v3-jsoneditor, .v3-jsoneditor *))',
          }),
        ],
      },
    },
    resolve: {
      dedupe: ['vue'],
      alias: [
        // Always demo the live library source.
        { find: /^v3-jsoneditor$/, replacement: path.resolve(__dirname, '../../index.js') },
        // src/ imports jsoneditor; resolve it from docs/node_modules (root may not have it).
        { find: /^jsoneditor(\/.*)?$/, replacement: `${path.resolve(__dirname, '../node_modules/jsoneditor')}$1` },
      ],
    },
    optimizeDeps: {
      exclude: ['v3-jsoneditor'],
    },
    ssr: {
      noExternal: ['v3-jsoneditor'],
    },
    server: {
      fs: { allow: [path.resolve(__dirname, '../..')] },
    },
  },
})
