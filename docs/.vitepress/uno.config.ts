import { defineConfig, presetIcons } from 'unocss'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Icons only: no utility preset, so nothing collides with VitePress class names (e.g. `.container`).
  presets: [
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        'flex-shrink': '0',
      },
      collections: {
        solar: () => import('@iconify-json/solar/icons.json').then((m) => m.default as any),
      },
    }),
  ],
  content: {
    pipeline: {
      include: [/\.(vue|md|mdx|ts|js|html)($|\?)/],
      exclude: [/[\\/]node_modules[\\/]/, /\.(css|postcss|scss)($|\?)/],
    },
    // Sidebar / nav HTML lives in config.ts, which is not part of the Vite module graph.
    filesystem: [
      path.join(root, 'config.ts'),
      path.join(root, 'theme/**/*.{vue,ts}'),
      path.join(root, '../*.md'),
      path.join(root, '../{guide,api,examples,ai}/**/*.{md,vue}'),
    ],
  },
})
