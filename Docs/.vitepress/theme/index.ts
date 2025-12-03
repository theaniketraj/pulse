import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ThemeLogo from './components/ThemeLogo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ThemeLogo', ThemeLogo)
  }
}
