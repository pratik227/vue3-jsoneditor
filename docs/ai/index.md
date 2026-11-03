---
title: Use with AI
description: Give AI assistants and coding agents accurate v3-jsoneditor context with llms.txt, llms-full.txt, per-page Markdown, and ready-to-paste setups for Claude Code, Cursor, Copilot, Codex and chat assistants.
---

# Use with AI

These docs are built to be read by AI assistants as well as people. Point your assistant at the right source and it will write correct v3-jsoneditor code instead of guessing from outdated examples.

## Machine-readable docs

| URL | What it is |
| --- | --- |
| [`/llms.txt`](https://v3-jsoneditor.netlify.app/llms.txt) | A short index of every page with its title and description, following the [llms.txt](https://llmstxt.org/) convention. Good for agents that fetch pages on demand. |
| [`/llms-full.txt`](https://v3-jsoneditor.netlify.app/llms-full.txt) | The complete documentation in one Markdown file. Best for pasting into a chat or loading as context. |
| Any page + `.md` | Append `.md` to any docs URL to get that page as clean Markdown, for example [`/guide/usage.md`](https://v3-jsoneditor.netlify.app/guide/usage.md) or [`/api/props.md`](https://v3-jsoneditor.netlify.app/api/props.md). |

The Markdown versions contain the full source of every live demo and plain tables for the API, without interactive widgets.

## Copy page / Ask AI

Every docs page has a **Copy page** button and an **Ask AI** menu at the top:

- **Copy page** copies the current page as Markdown, ready to paste into any assistant.
- **Ask AI** opens your assistant of choice (ChatGPT, Claude, Grok, Perplexity, and others) with a prompt that references the page. For DeepSeek and Gemini, which do not accept a prefilled prompt from a link, the prompt is copied to your clipboard and the site opens in a new tab: just paste.

## Claude Code

Add this to your project's `CLAUDE.md`:

```md
## v3-jsoneditor

This project uses v3-jsoneditor (Vue 3 wrapper for josdejong/jsoneditor).
When working with it, fetch https://v3-jsoneditor.netlify.app/llms-full.txt
for the current API instead of relying on memory. Import it as
`import Vue3Jsoneditor from 'v3-jsoneditor'`.
```

### Optional: a Claude Code skill

For on-demand loading, create `.claude/skills/v3-jsoneditor/SKILL.md`:

```md
---
name: v3-jsoneditor
description: Use when adding, configuring or debugging the v3-jsoneditor Vue 3 JSON editor component (Vue3Jsoneditor, jsoneditor modes, JSON Schema validation, theming, fullscreen, toolbar slot).
---

# v3-jsoneditor

Full docs: https://v3-jsoneditor.netlify.app/llms-full.txt (fetch when unsure).

Rules:
- Import: `import Vue3Jsoneditor from 'v3-jsoneditor'`. Global: `app.use(Vue3Jsoneditor)`.
- Bind with `v-model`; any JSON value works (object, array, primitive, null).
  Clearing the editor in code/text mode emits `null`.
- Modes: tree, code (default), form, text, view. Use `current-mode`,
  `:mode-list`, and `v-model:currentMode`.
- Raw text: `v-model:text`. Read-only: `read-only`. Large docs: `:debounce="200"`.
- Global defaults: `app.use(Vue3Jsoneditor, { theme: 'auto', height: 500 })`.
- Always set `height` (string CSS length or number in px) or give the parent a height.
- Pass jsoneditor options via `:options`. Props win over options; callbacks
  in options run in addition to the component's events.
- Validation: `options.schema` (reactive), `options.onValidate`;
  listen to `@validation-error` (schema) and `@error` (invalid JSON text).
- Theme: `theme="light" | "dark" | "auto" | "classic"`; customize with
  `--vje-*` CSS variables on a class added to the component.
- Fullscreen: `plus` shows the button, `v-model:fullscreen`, Esc exits.
- Template ref methods: getEditor(), get(), getText(), validate(),
  expandAll(), collapseAll(),
  setEditorContent(json), toggleFullScreen(), focus().
- Toolbar: `<template #toolbar="{ editor, mode }">`.
- SSR (Nuxt/VitePress): import is safe; wrap in `<ClientOnly>`.
- Large data: use `shallowRef` and start in code mode.
```

## Cursor, GitHub Copilot, OpenAI Codex, Windsurf

Most coding agents read an `AGENTS.md` file at the repository root (Copilot also reads `.github/copilot-instructions.md`, Windsurf reads `.windsurfrules`). Add:

```md
## v3-jsoneditor

- Docs for agents: https://v3-jsoneditor.netlify.app/llms-full.txt
- Per-page Markdown: append `.md` to any https://v3-jsoneditor.netlify.app URL.
- Import with `import Vue3Jsoneditor from 'v3-jsoneditor'`; bind with `v-model`.
- Prefer component props/events (currentMode, theme, fullscreen, validation-error)
  over calling jsoneditor directly; use `getEditor()` only for advanced APIs.
```

**Cursor @Docs:** open *Cursor Settings → Indexing & Docs → Add Doc* and enter `https://v3-jsoneditor.netlify.app/llms-full.txt`. Then reference it in chat with `@Docs v3-jsoneditor`.

## ChatGPT, Claude.ai, Grok, DeepSeek, Gemini, Perplexity

In any chat assistant:

1. Paste the URL `https://v3-jsoneditor.netlify.app/llms-full.txt` and ask it to read it (assistants with browsing), **or**
2. Open `/llms-full.txt`, copy everything and paste it into the chat (works everywhere), **or**
3. Use the **Ask AI** menu on the page you are reading. For DeepSeek and Gemini the prompt is copied to your clipboard; paste it into the chat.

## In your node_modules

The npm package itself ships:

- `llms.txt`: the same index as the website, so agents working offline can find the docs.
- **TypeScript types with JSDoc** for every prop, event and method. Coding agents and editors read these from `node_modules/v3-jsoneditor`, which gives accurate autocompletion and fewer hallucinated props.

## Prompt recipes

Copy and adapt these prompts:

::: details Settings editor with validation
> Using v3-jsoneditor (docs: https://v3-jsoneditor.netlify.app/llms-full.txt), build a Vue 3 `<SettingsEditor>` component that edits a settings object in `form` mode, validates it with this JSON Schema: `<paste schema>`, disables a Save button while there are validation errors, and emits `save` with the JSON.
:::

::: details Read-only API response viewer
> Using v3-jsoneditor, create a component that fetches `<url>` and shows the response in a read-only `view` mode tree with `theme="auto"`, 400px high, with an "Expand all" / "Collapse all" toggle using the template ref methods.
:::

::: details Nuxt integration
> Add v3-jsoneditor to my Nuxt 4 app following https://v3-jsoneditor.netlify.app/guide/ssr.md: create a client plugin, use the editor inside `<ClientOnly>` with a same-height fallback, and bind it to a `useState` value.
:::

::: details Migrate from 0.0.x
> Upgrade my project from v3-jsoneditor 0.0.x to the latest version following https://v3-jsoneditor.netlify.app/guide/migration.md. Update imports, keep the old look with `theme="classic"`, and remove any `options.onChange` that duplicates a `@change` listener.
:::
