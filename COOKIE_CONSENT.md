# Cookie Consent & Analytics System

Comprehensive cookie consent and analytics implementation for Vitals documentation site.

## Features

### Cookie Consent Banner

- **Theme-Aware**: Automatically matches light/dark theme
- **Smart Re-prompting**: Re-asks users who declined after 7 days
- **Persistent Accept**: Accepted consent stored for 1 year
- **Privacy-First**: Easy opt-out, no tracking without consent

### Analytics Tracking

- **Page Views**: Track page navigation and time spent
- **User Interactions**: Scroll depth, outbound links, theme changes
- **Feature Usage**: Search queries, code copying
- **Session Tracking**: Session duration, navigation patterns

### Service Worker

- **Offline Support**: Caches essential resources
- **PWA Ready**: Manifest for progressive web app
- **Privacy Respecting**: Only tracks with user consent
- **Background Sync**: Queues analytics when offline

## Implementation

### Components

#### 1. CookieConsent.vue

Location: `docs/.vitepress/theme/CookieConsent.vue`

**Features:**

- Animated slide-up banner
- Accept/Decline buttons
- Theme-responsive styling
- Links to privacy policy

**Usage:**

```vue
import CookieConsent from './CookieConsent.vue'

// Automatically shows on first visit
// Stores consent in localStorage
```

#### 2. Analytics Utility

Location: `docs/.vitepress/theme/analytics.ts`

**Class: VitalsAnalytics**

```typescript
import { analytics } from './analytics'

// Track custom events
analytics.track('custom_event', { 
  property: 'value' 
})

// Track page views
analytics.trackPageView()

// Track theme changes
analytics.trackThemeChange('dark')

// Update consent
analytics.updateConsent(true)
```

**Auto-Tracked Events:**

- `page_view` - Page navigation
- `time_on_page` - Time spent on page
- `scroll_depth` - Scroll milestones (25%, 50%, 75%, 100%)
- `internal_navigation` - Internal link clicks
- `external_link` - External link clicks
- `theme_change` - Theme toggle
- `session_end` - Session duration

#### 3. Service Worker

Location: `docs/public/sw.js`

**Features:**

- Caches static assets
- Offline fallback
- Analytics event queuing
- Consent management

**Registration:**

```javascript
// Auto-registered in config.mts
navigator.serviceWorker.register('/vitals/sw.js')
```

### Configuration

#### VitePress Config

`docs/.vitepress/config.mts`

```typescript
head: [
  // PWA manifest
  ["link", { rel: "manifest", href: "/vitals/manifest.json" }],
  
  // Service worker registration
  ["script", { 
    children: `
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/vitals/sw.js')
      }
    `
  }]
]
```

#### Theme Integration

`docs/.vitepress/theme/index.ts`

```typescript
import CookieConsent from './CookieConsent.vue'

export default {
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => [h(Footer), h(CookieConsent)]
    })
  }
}
```

## Data Collected

### With Consent ✅

- Page paths (not full URLs)
- Session IDs (random, anonymous)
- Interaction events (clicks, scrolls)
- Time metrics (duration, timestamps)
- System info (viewport size, language)

### Never Collected ❌

- Personal information
- Form data
- File contents
- IP addresses (backend dependent)
- Cross-site tracking

## Storage

### LocalStorage Keys

```javascript
'vitals-cookie-consent'           // 'true' | 'false'
'vitals-cookie-consent-timestamp' // Unix timestamp
```

### Cookie Lifetime

- **Accept Duration**: 365 days (1 year)
- **Decline Duration**: 7 days (re-prompt after)
- **Auto-Renewal**: On each visit if accepted
- **Expiry Behavior**: 
  - Accepted: Re-prompt after 1 year
  - Declined: Re-prompt after 7 days

## Privacy Compliance

### GDPR Compliant

- ✅ Clear consent request
- ✅ Easy opt-out
- ✅ Data minimization
- ✅ Purpose limitation
- ✅ Transparency

### User Rights

- **Access**: View collected data
- **Delete**: Request data deletion
- **Export**: Download data
- **Opt-Out**: Disable at any time

## Testing

### Local Development

```bash
npm run docs:dev
```

**Test Scenarios:**

1. First visit → Banner appears
2. Accept → Banner disappears, tracking starts
3. Decline → Banner disappears, no tracking
4. Reload → No banner (consent stored)
5. Theme toggle → Tracked (if consented)

### Clear Consent

```javascript
// Browser console
localStorage.removeItem('vitals-cookie-consent')
localStorage.removeItem('vitals-cookie-consent-timestamp')
location.reload()
```

### Debug Mode

```javascript
// Browser console
window.vitalsAnalytics.track('test_event', { test: true })
```

## Analytics Backend Integration

### Send to Your API

Edit `analytics.ts`:

```typescript
private async sendToBackend(event: AnalyticsEvent): Promise<void> {
  await fetch('https://your-api.com/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  })
}
```

### Service Worker Sync

Edit `sw.js`:

```javascript
async function trackAnalytics(eventName, properties) {
  await fetch('https://your-api.com/track', {
    method: 'POST',
    body: JSON.stringify({ event: eventName, ...properties })
  })
}
```

## Styling

### Theme Colors

**Light Theme:**

- Banner Background: Linear gradient (purple)
- Accept Button: White
- Decline Button: Transparent overlay

**Dark Theme:**

- Banner Background: Dark gradient
- Accept Button: Blue (#3b82f6)
- Decline Button: Transparent overlay

### Responsive Breakpoints

- **Desktop**: Full width, horizontal layout
- **Tablet** (768px): Stacked layout
- **Mobile** (480px): Full-width buttons

## Files Structure

```
docs/
├── .vitepress/
│   ├── config.mts              # VitePress config with SW
│   └── theme/
│       ├── index.ts            # Theme with CookieConsent
│       ├── CookieConsent.vue   # Consent banner component
│       ├── analytics.ts        # Analytics utility class
│       └── custom.css          # Theme styles
├── public/
│   ├── sw.js                   # Service worker
│   └── manifest.json           # PWA manifest
└── privacy.md                  # Privacy policy
```

## Events Reference

| Event | Properties | Trigger |
|-------|-----------|---------|
| `cookie_consent_accepted` | `timestamp` | Accept clicked |
| `page_view` | `path`, `title`, `referrer` | Page load |
| `time_on_page` | `duration`, `path` | Page unload |
| `scroll_depth` | `depth`, `path` | 25/50/75/100% |
| `internal_navigation` | `from`, `to`, `text` | Link click |
| `external_link` | `url`, `text` | External link |
| `theme_change` | `theme` | Theme toggle |
| `session_end` | `sessionId`, `duration` | Browser close |
| `search` | `query`, `resultsCount` | Search performed |
| `code_copy` | `language`, `path` | Code copied |

## Best Practices

### Performance

- ✅ Lazy load analytics (after consent)
- ✅ Debounce scroll tracking
- ✅ Queue events when offline
- ✅ Minimize payload size

### Privacy

- ✅ No cookies without consent
- ✅ Anonymize all identifiers
- ✅ Clear data on opt-out
- ✅ Respect DNT header

### UX

- ✅ Non-intrusive banner
- ✅ One-time prompt
- ✅ Theme-aware design
- ✅ Mobile-friendly

## Troubleshooting

### Banner Not Showing

```javascript
// Clear storage and reload
localStorage.clear()
location.reload()
```

### Analytics Not Tracking

1. Check console for errors
2. Verify consent: `localStorage.getItem('vitals-cookie-consent')`
3. Check SW registration: `navigator.serviceWorker.controller`

### Service Worker Issues

```bash
# Unregister all service workers
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()))
```

## License

Same as Vitals extension - see main LICENSE file.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Resources

- [Privacy Policy](./docs/privacy.md)
- [Usage Statistics](./docs/USAGE_STATISTICS.md)
- [VitePress Docs](https://vitepress.dev/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
