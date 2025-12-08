<template>
  <footer class="vitals-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- About Section -->
        <div class="footer-column">
          <h3>About</h3>
          <ul>
            <li><a href="/vitals/introduction">What is Vitals?</a></li>
            <li><a href="/vitals/vision">Vision & Roadmap</a></li>
            <li><a href="/vitals/system_architecture">Architecture</a></li>
            <li><a href="/vitals/components">Components</a></li>
          </ul>
        </div>

        <!-- Documentation Section -->
        <div class="footer-column">
          <h3>Documentation</h3>
          <ul>
            <li><a href="/vitals/getting_started">Getting Started</a></li>
            <li><a href="/vitals/api">API Reference</a></li>
            <li><a href="/vitals/troubleshooting">Troubleshooting</a></li>
            <li><a href="/vitals/project_structure">Project Structure</a></li>
          </ul>
        </div>

        <!-- Contributing Section -->
        <div class="footer-column">
          <h3>Contributing</h3>
          <ul>
            <li><a href="/vitals/contributing">Contribution Guide</a></li>
            <li><a href="/vitals/development">Development Setup</a></li>
            <li><a href="/vitals/testing">Testing Guide</a></li>
            <li><a href="/vitals/code_of_conduct">Code of Conduct</a></li>
          </ul>
        </div>

        <!-- Community Section -->
        <div class="footer-column">
          <h3>Community</h3>
          <ul>
            <li>
              <a
                href="https://github.com/theaniketraj/vitals"
                target="_blank"
                rel="noopener"
                >GitHub</a
              >
            </li>
            <li>
              <a
                href="https://github.com/theaniketraj/vitals/issues"
                target="_blank"
                rel="noopener"
                >Report Issues</a
              >
            </li>
            <li>
              <a
                href="https://github.com/theaniketraj/vitals/discussions"
                target="_blank"
                rel="noopener"
                >Discussions</a
              >
            </li>
            <li><a href="/vitals/security">Security Policy</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p>
          Released under the
          <a
            href="https://github.com/theaniketraj/vitals/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
            >MIT License</a
          >
        </p>
        <p>
          Copyright © 2025
          <a
            href="https://theaniketraj.netlify.app"
            target="_blank"
            rel="noopener"
            >Aniket Raj</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.vitals-footer {
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  padding: 48px 24px 32px;
  margin: 0;
}

.footer-content {
  max-width: 1152px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 32px;
}

.footer-column h3 {
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 10px;
}

.footer-column a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
  line-height: 1.6;
}

.footer-column a:hover {
  color: var(--vp-c-brand-1);
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.footer-bottom a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-bottom a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 960px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .vitals-footer {
    padding: 32px 16px 24px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
