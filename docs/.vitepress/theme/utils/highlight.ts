import type { HighlighterCore } from 'shiki/core'

let highlighter: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!highlighter) {
    highlighter = (async () => {
      const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
        import('shiki/core'),
        import('shiki/engine/javascript'),
      ])
      return createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [
          import('shiki/langs/vue.mjs'),
          import('shiki/langs/json.mjs'),
          import('shiki/langs/css.mjs'),
          import('shiki/langs/typescript.mjs'),
          import('shiki/langs/bash.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      })
    })()
  }
  return highlighter
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Plain fallback used for SSR and until shiki has loaded. */
export function plainHtml(code: string) {
  return `<pre class="shiki"><code>${escape(code)}</code></pre>`
}

/** Highlight with dual GitHub themes; colours switch via `--shiki-light` / `--shiki-dark`. */
export async function highlight(code: string, lang = 'vue'): Promise<string> {
  try {
    const hl = await getHighlighter()
    const loaded = hl.getLoadedLanguages()
    return hl.codeToHtml(code, {
      lang: loaded.includes(lang) ? lang : 'text',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
  } catch {
    return plainHtml(code)
  }
}

/** Copy text to the clipboard with a textarea fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}
