import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/pulse/",
  title: "Pulse",
  description: "Real-time Observability for VS Code",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/icon.png" }],
    ["meta", { name: "theme-color", content: "#3b82f6" }],
  ],

  themeConfig: {
    logo: "/icon.png",
    siteTitle: "Pulse Dashboard",

    nav: [
      { text: "Guide", link: "/GETTING_STARTED" },
      { text: "Architecture", link: "/SYSTEM_ARCHITECTURE" },
      { text: "API", link: "/API" },
      {
        text: "v0.1.0",
        items: [
          {
            text: "Changelog",
            link: "https://github.com/theaniketraj/pulse/releases",
          },
          { text: "Contributing", link: "/CONTRIBUTING" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Pulse?", link: "/INTRODUCTION" },
          { text: "Vision & Roadmap", link: "/VISION" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Installation", link: "/GETTING_STARTED#installation" },
          { text: "Configuration", link: "/GETTING_STARTED#configuration" },
          { text: "Troubleshooting", link: "/TROUBLESHOOTING" },
        ],
      },
      {
        text: "Architecture",
        items: [
          { text: "System Overview", link: "/SYSTEM_ARCHITECTURE" },
          { text: "Components", link: "/COMPONENTS" },
          { text: "Data Flow", link: "/SYSTEM_ARCHITECTURE#data-flow" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Extension API", link: "/API" },
          { text: "Project Structure", link: "/PROJECT_STRUCTURE" },
        ],
      },
      {
        text: "Contributing",
        items: [
          { text: "Development Guide", link: "/DEVELOPMENT" },
          { text: "Testing", link: "/TESTING" },
          { text: "Code of Conduct", link: "/CODE_OF_CONDUCT" },
          { text: "Security", link: "/SECURITY" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/theaniketraj/pulse" },
    ],

    footer: {
      message:
        'Released under the <a href="https://github.com/theaniketraj/pulse/blob/main/LICENSE" target="_blank">MIT License</a>.',
      copyright:
        'Copyright © 2025 <a href="https://theaniketraj.netlify.app" target="_blank">Aniket Raj</a>',
    },

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/theaniketraj/pulse/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
