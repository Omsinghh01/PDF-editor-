# App Icons

This directory contains the application icons for the PDF Editor Pro desktop app.

## Required Icon Files

To complete the desktop app setup, you need to add the following icon files:

### Windows
- `icon.ico` - 256x256px ICO file for Windows builds

### macOS
- `icon.icns` - ICNS file for macOS builds (containing multiple sizes: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024)

### Linux
- `icon.png` - 512x512px PNG file for Linux builds

## Icon Requirements

- **Recommended size**: 1024x1024px for source image
- **Format**: PNG for source, then convert to platform-specific formats
- **Design**: Should represent PDF editing (document with tools/pen icon)
- **Background**: Transparent for PNG/ICNS, can have background for ICO

## How to Generate Icons

1. Create a 1024x1024px PNG icon
2. Use online converters or tools like:
   - For ICO: https://convertio.co/png-ico/
   - For ICNS: https://iconverticons.com/online/
   - For PNG: Just resize to 512x512px

## Temporary Solution

For now, you can use any existing PNG image as `icon.png` to test the build process.
The app will build without icons, but they won't display properly in the OS.

## Example Icon Design Ideas

- PDF document with a pen/pencil
- Document with editing tools around it
- Letter "P" in a document shape
- Modern flat design with PDF + edit symbols