import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import ScreenshotPlaceholder from './components/ScreenshotPlaceholder.vue'
import { installPageStyles } from './pageStyles'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('ScreenshotPlaceholder', ScreenshotPlaceholder)
    installPageStyles(router)
  }
} satisfies Theme
