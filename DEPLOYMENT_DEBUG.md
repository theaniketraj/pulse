# GitHub Pages Deployment Debugging Checklist

## Run This Script First

```bash
bash debug-deployment.sh
```

## Critical Information Needed

### 1. GitHub Pages Settings

**Go to: Repository → Settings → Pages**

Provide these values:

- [ ] Source: (Branch deployment / GitHub Actions)
- [ ] Branch: (which branch?)
- [ ] Folder: (/ root or /docs?)
- [ ] Custom domain: (if any)
- [ ] Current Pages URL shown: _______________

### 2. Workflow Execution

**Go to: Actions tab → Latest workflow run**

Check and provide:

- [ ] Workflow status: (Success / Failed)
- [ ] Copy the "Debug - Show build output structure" step output
- [ ] Copy the "Deploy to GitHub Pages" step output
- [ ] Any error messages?

### 3. Browser Console Errors

**Visit: <https://theaniketraj.github.io/vitals/>**

In browser console (F12), note:

- [ ] Main error: _______________
- [ ] Asset URLs being requested: _______________
- [ ] HTTP status codes: _______________

### 4. gh-pages Branch Check

**Go to: Repository → Branches**

Check if `gh-pages` branch exists:

- [ ] gh-pages branch exists: Yes / No
- [ ] Latest commit: _______________
- [ ] Browse gh-pages branch and check if files are there

**Browse gh-pages branch and verify:**

- [ ] index.html exists at root: Yes / No
- [ ] assets/ folder exists: Yes / No
- [ ] vp-icons.css exists: Yes / No

### 5. Asset Path Analysis

From the deployed site HTML source (View Page Source):

```html
<!-- What do the asset paths look like? -->
<link href="____" />  <!-- Should be /vitals/assets/... -->
<script src="____" /> <!-- Should be /vitals/assets/... -->
```

### 6. VitePress Config Check

```bash
cat docs/.vitepress/config.mts | grep -A 2 "base:"
```

Output: _______________

## Expected vs Actual

| Item | Expected | Actual |
|------|----------|--------|
| Pages Source | gh-pages branch | _____ |
| Site URL | /vitals/ | _____ |
| Asset paths | /vitals/assets/* | _____ |
| VitePress base | '/vitals/' | _____ |

## Quick Diagnosis

If you see:

- **404 on /vitals/** → gh-pages branch might be empty or Pages not configured
- **404 on /vitals/assets/** → Base path mismatch (VitePress base vs actual serving)
- **404 on /assets/** → Missing /vitals/ prefix in VitePress config
- **White screen, no errors** → JavaScript not loading, check paths

## Next Steps

After running debug script and collecting the above info, paste the outputs here so we can identify the exact issue.
