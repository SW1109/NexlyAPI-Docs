import DefaultTheme from 'vitepress/theme'
import ApiReference from './components/ApiReference.vue'
import HomePage from './components/HomePage.vue'
import Layout from './Layout.vue'
import ScreenshotPlaceholder from './components/ScreenshotPlaceholder.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ApiReference', ApiReference)
    app.component('HomePage', HomePage)
    app.component('ScreenshotPlaceholder', ScreenshotPlaceholder)
  }
}
