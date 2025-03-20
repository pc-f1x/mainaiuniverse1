# AI Universe

AI Universe is a Progressive Web App (PWA) that provides a curated collection of the best AI tools available worldwide. Users can search, browse by category, and save their favorite AI tools for easy access.

## Features

- **Search functionality**: Find AI tools quickly by name, category, or description
- **Category filtering**: Browse tools by categories like Chat, Image Creation, Video Creation, etc.
- **Favorites**: Save your preferred tools for quick access
- **Responsive design**: Works perfectly on mobile, tablet, and desktop devices
- **Offline support**: Basic functionality works even without an internet connection
- **Installable**: Can be installed as a standalone app on Windows, Android, iOS, and macOS

## PWA Setup

To complete setting up this app as a PWA for stores like Google Play and App Store using PWABuilder, you need to:

1. **Create the app icons**:
   - Place the following icon files in the `/icons` folder:
     - `icon-192x192.png` (192x192px)
     - `icon-512x512.png` (512x512px)  
     - `icon-192x192-maskable.png` (192x192px with safe area)
     - `icon-512x512-maskable.png` (512x512px with safe area)
     - `favorite-192x192.png` (192x192px shortcut icon)

2. **Add screenshots**:
   - Place screenshots in the `/screenshots` folder:
     - `screenshot1.png` (1280x720px - desktop)
     - `screenshot2.png` (1280x720px - desktop category view)
     - `screenshot3.png` (750x1334px - mobile view)

3. **Test the PWA**:
   - Use Lighthouse in Chrome DevTools to check PWA requirements
   - Test installation on different devices
   - Verify that offline functionality works correctly

4. **Submit to PWABuilder**:
   - Go to [PWABuilder](https://www.pwabuilder.com/)
   - Enter your website URL
   - Follow the instructions to package your PWA for different stores

## Development

The app is built using vanilla JavaScript, HTML, and CSS with no external dependencies.

- `index.html` - Main application structure
- `styles.css` - All styling for the application
- `script.js` - Application logic and functionality
- `manifest.json` - PWA configuration
- `sw.js` - Service Worker for offline functionality
- `icons/` - App icons
- `screenshots/` - App screenshots

## License

This project is proprietary software with All Rights Reserved. No rights or licenses are granted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software. Unauthorized use is strictly prohibited and may result in legal action. See the LICENSE file for details.

## Contact

For any questions or concerns, please contact: [israel.shalum@proton.me](mailto:israel.shalum@proton.me) 