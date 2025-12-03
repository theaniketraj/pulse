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
    siteTitle: "Pulse",

    nav: [
      { text: "Guide", link: "/getting_started" },
      { text: "Architecture", link: "/system_architecture" },
      { text: "API", link: "/api" },
      {
        text: "v0.1.0",
        items: [
          {
            text: "Changelog",
            link: "https://github.com/theaniketraj/pulse/releases",
          },
          { text: "Contributing", link: "/contributing" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Pulse?", link: "/introduction" },
          { text: "Vision & Roadmap", link: "/vision" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Installation", link: "/getting_started#installation" },
          { text: "Configuration", link: "/getting_started#configuration" },
          { text: "Troubleshooting", link: "/troubleshooting" },
        ],
      },
      {
        text: "Architecture",
        items: [
          { text: "System Overview", link: "/system_architecture" },
          { text: "Components", link: "/components" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Extension API", link: "/api" },
          { text: "Project Structure", link: "/project_structure" },
        ],
      },
      {
        text: "Contributing",
        items: [
          { text: "Development Guide", link: "/development" },
          { text: "Testing", link: "/testing" },
          { text: "Code of Conduct", link: "/code_of_conduct" },
          { text: "Security", link: "/security" },
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
      pattern: "https://github.com/theaniketraj/pulse/edit/main/Docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
