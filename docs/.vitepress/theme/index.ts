import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import 'virtual:uno.css'
import 'virtual:group-icons.css'
import './style.css'

import HomeHero from './components/HomeHero.vue'
import HomeLanding from './components/HomeLanding.vue'
import CardGrid from './components/CardGrid.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import DemoBlock from './components/DemoBlock.vue'
import Playground from './components/Playground.vue'
import ThemeGallery from './components/ThemeGallery.vue'
import PageActions from './components/PageActions.vue'
import SponsorCard from './components/SponsorCard.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PageActions),
    })
  },
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('HomeLanding', HomeLanding)
    app.component('CardGrid', CardGrid)
    app.component('FeatureGrid', FeatureGrid)
    app.component('DemoBlock', DemoBlock)
    app.component('Playground', Playground)
    app.component('ThemeGallery', ThemeGallery)
    app.component('PageActions', PageActions)
    app.component('SponsorCard', SponsorCard)
  },
} satisfies Theme
