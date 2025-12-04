# Theme-Aware Logo Setup

The Vitals documentation now supports theme-aware logos that change based on light/dark mode.

## Current Setup

- **Light Mode**: `Docs/public/icon-light.png`
- **Dark Mode**: `Docs/public/icon-dark.png`

## Customizing the Logos

Currently, both `icon-light.png` and `icon-dark.png` are copies of the original `icon.png`. To create proper theme-specific versions:

### For Light Mode (`icon-light.png`)
- Use darker colors that work well on white/light backgrounds
- Ensure good contrast against light gray backgrounds
- Consider using black or dark blue tones

### For Dark Mode (`icon-dark.png`)
- Use lighter colors that work well on dark backgrounds
- Ensure good contrast against dark gray backgrounds
- Consider using white or bright colors
- You can add glow effects or neon-style colors for modern dark theme aesthetics

## How to Update

1. Design your light and dark versions
2. Export as PNG files (recommended size: 400x400 to 600x600 pixels)
3. Replace:
   - `Docs/public/icon-light.png` with your light theme version
   - `Docs/public/icon-dark.png` with your dark theme version

## Tools for Creating Theme Variants

- **Photoshop/GIMP**: Adjust brightness, contrast, and apply color filters
- **Figma**: Create separate variants with different color schemes
- **ImageMagick** (CLI): Batch process to invert colors:
  ```bash
  # Invert for dark theme
  convert icon.png -negate icon-dark.png
  
  # Adjust brightness/contrast
  convert icon.png -brightness-contrast 20x20 icon-dark.png
  ```

## Where Logos Appear

- **Navbar**: Small logo next to site title (changes with theme)
- **Homepage Hero**: Large logo in the center of landing page (changes with theme)
- **Favicon**: Browser tab icon (currently uses default icon.png)

The logos automatically switch when users toggle between light and dark themes.
