<template>
  <footer class="pulse-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- About Section -->
        <div class="footer-column">
          <h3>About</h3>
          <ul>
            <li><a href="/pulse/introduction">What is Pulse?</a></li>
            <li><a href="/pulse/vision">Vision & Roadmap</a></li>
            <li><a href="/pulse/system_architecture">Architecture</a></li>
            <li><a href="/pulse/components">Components</a></li>
          </ul>
        </div>

        <!-- Documentation Section -->
        <div class="footer-column">
          <h3>Documentation</h3>
          <ul>
            <li><a href="/pulse/getting_started">Getting Started</a></li>
            <li><a href="/pulse/api">API Reference</a></li>
            <li><a href="/pulse/troubleshooting">Troubleshooting</a></li>
            <li><a href="/pulse/project_structure">Project Structure</a></li>
          </ul>
        </div>

        <!-- Contributing Section -->
        <div class="footer-column">
          <h3>Contributing</h3>
          <ul>
            <li><a href="/pulse/contributing">Contribution Guide</a></li>
            <li><a href="/pulse/development">Development Setup</a></li>
            <li><a href="/pulse/testing">Testing Guide</a></li>
            <li><a href="/pulse/code_of_conduct">Code of Conduct</a></li>
          </ul>
        </div>

        <!-- Community Section -->
        <div class="footer-column">
          <h3>Community</h3>
          <ul>
            <li><a href="https://github.com/theaniketraj/pulse" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="https://github.com/theaniketraj/pulse/issues" target="_blank" rel="noopener">Report Issues</a></li>
            <li><a href="https://github.com/theaniketraj/pulse/discussions" target="_blank" rel="noopener">Discussions</a></li>
            <li><a href="/pulse/security">Security Policy</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-info">
          <p>Released under the <a href="https://github.com/theaniketraj/pulse/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a></p>
          <p>Copyright © 2025 <a href="https://theaniketraj.netlify.app" target="_blank" rel="noopener">Aniket Raj</a></p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.pulse-footer {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 0;
  margin-bottom: 0;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 24px 32px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
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
  margin-bottom: 12px;
}

.footer-column a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
}

.footer-column a:hover {
  color: var(--vp-c-brand-1);
}

.footer-bottom {
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
}

.footer-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-info p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.footer-info a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-info a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  
  .footer-container {
    padding: 32px 16px 24px;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
