---
title: Pulse Troubleshooting Guide
description: Common issues and solutions for Pulse VS Code extension - debugging, connection problems, and error fixes.
head:
  - - meta
    - name: keywords
      content: troubleshooting, debugging, error fixes, common issues, problem solving, support
---

# Pulse Extension Troubleshoot Guide

## Current Status

[] Extension built successfully  
[] Package.json configuration fixed  
[] Activation event set to "\*" (activates on startup)  
[] Enhanced debugging added  
[] Mock Prometheus server running

## Testing Steps

### 1. Open Extension Development Window

```bash
cd /d/ceie/pulse
code --extensionDevelopmentPath=. --new-window
```

### 2. Check Extension Activation

- **Look for popup message**: "Pulse extension is now active!"
- **Open Developer Console**: `Help` → `Toggle Developer Tools` → `Console`
- **Look for logs**:

  ```bash
  🚀 Pulse extension activated
  ✅ Command "pulse.openDashboard" registered successfully
  ```

### 3. Test Command Palette

- Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- Type: `Open Pulse`
- **Expected**: Command should appear in the list

### 4. If Command Still Missing

#### Option A: Check Extension Host Console

1. Open `Help` → `Toggle Developer Tools`
2. Go to `Console` tab
3. Look for any error messages
4. Check if extension activated properly

#### Option B: Reload Extension Host

1. Press `Ctrl+Shift+P`
2. Type: `Developer: Reload Window`
3. Execute the command
4. Check for activation message again

#### Option C: Check Extension List

1. Go to Extensions panel (`Ctrl+Shift+X`)
2. Search for "Pulse"
3. Verify it shows as "Development Extension"

### 5. Manual Command Execution

If the command palette doesn't show the command, try:

1. Press `Ctrl+Shift+P`
2. Type: `>pulse.openDashboard`
3. Press Enter

## Common Issues & Solutions

### Issue: Extension Not Activating

**Symptoms**: No popup message, no console logs
**Solutions**:

- Check if `dist/extension.js` exists
- Verify VS Code opened with `--extensionDevelopmentPath=.`
- Check for TypeScript compilation errors

### Issue: Command Not Showing

**Symptoms**: Extension activates but command missing from palette
**Solutions**:

- Reload the window (`Developer: Reload Window`)
- Check package.json syntax
- Verify command ID matches between package.json and extension.ts

### Issue: Command Exists But Fails

**Symptoms**: Command appears but throws error when executed
**Solutions**:

- Check webview bundle exists in `webview/build/`
- Verify React components compile correctly
- Check browser console for JavaScript errors

## Debug Information to Collect

### Extension Host Console

```bash
🚀 Pulse extension activated
✅ Command "pulse.openDashboard" registered successfully
📊 Opening Pulse... (when command executed)
```

### VS Code Output Panel

- Go to `View` → `Output`
- Select `Log (Extension Host)` from dropdown
- Look for Pulse related logs

### Browser Console (for webview)

- Right-click in dashboard webview
- Select `Inspect Element`
- Check Console tab for React/JavaScript errors

## Expected Results

1. **On VS Code startup**: Popup "Pulse extension is now active!"
2. **In Command Palette**: "Open Pulse" command visible
3. **When executed**: Dashboard panel opens beside editor
4. **Dashboard content**: Shows "Pulse" header
5. **Network activity**: Requests to localhost:9090 for metrics

## If All Else Fails

Try this minimal test:

1. Open VS Code normally (not extension dev mode)
2. Open Extensions panel
3. Click "Install from VSIX..."
4. Package the extension: `vsce package`
5. Install the generated .vsix file

## Next Steps

If the command still doesn't appear after following these steps, please share:

1. Screenshot of Extension Host Console
2. Contents of Output → Log (Extension Host)
3. Any error messages in Developer Tools Console
