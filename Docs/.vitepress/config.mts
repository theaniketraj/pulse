import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/pulse/",
  title: "Pulse",
  description: "Real-time Observability for VS Code",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/pulse/icon.png" }],
    ["meta", { name: "theme-color", content: "#3b82f6" }],
    ["meta", { name: "author", content: "Aniket Raj" }],
    ["meta", { name: "keywords", content: "VS Code extension, Prometheus, observability, monitoring, metrics, logs, alerts, developer tools, real-time monitoring, application monitoring" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Pulse - Real-time Observability for VS Code" }],
    ["meta", { property: "og:description", content: "Monitor application metrics, logs, and alerts directly in Visual Studio Code. Integrated with Prometheus for seamless developer experience." }],
    ["meta", { property: "og:url", content: "https://theaniketraj.github.io/pulse/" }],
    ["meta", { property: "og:image", content: "https://theaniketraj.github.io/pulse/icon.png" }],
    ["meta", { property: "og:site_name", content: "Pulse" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Pulse - Real-time Observability for VS Code" }],
    ["meta", { name: "twitter:description", content: "Monitor application metrics, logs, and alerts directly in Visual Studio Code. Integrated with Prometheus for seamless developer experience." }],
    ["meta", { name: "twitter:image", content: "https://theaniketraj.github.io/pulse/icon.png" }],
    ["meta", { name: "twitter:creator", content: "@theaniketraj" }],
    ["link", { rel: "canonical", href: "https://theaniketraj.github.io/pulse/" }],
    ["meta", { name: "robots", content: "index, follow" }],
    ["meta", { name: "googlebot", content: "index, follow" }],
  ],

  themeConfig: {
    logo: {
      light: "/icon-light.png",
      dark: "/icon-dark.png",
    },
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
          { text: "Getting Started", link: "/getting_started" },
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
