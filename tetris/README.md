# Modern Tetris 2025

A modern, responsive Tetris game with sleek UI/UX design, built using HTML5, JavaScript, and Tailwind CSS.

## Features

- 🎮 Modern glass-morphism UI design
- 💫 Particle effects and animations
- 🌈 Neon color scheme with glow effects
- 📱 Responsive design for all devices
- 🎯 Touch/swipe controls for mobile
- ⚡ Fast-paced gameplay with combo system
- 💰 Prepared for monetization with Google AdSense
- 🎨 Modern scoring and level system

## Playing the Game

### Desktop Controls
- ⬅️ Left Arrow: Move piece left
- ➡️ Right Arrow: Move piece right
- ⬇️ Down Arrow: Move piece down
- ⬆️ Up Arrow: Rotate piece
- Space: Hard drop

### Mobile Controls
- Swipe left/right: Move piece
- Swipe down: Move piece down
- Swipe up: Rotate piece
- Tap buttons on screen for movement

## Converting to Mobile Apps

### Using Capacitor (Recommended)

1. Install Capacitor:
```bash
npm init
npm install @capacitor/core @capacitor/cli
npx cap init
```

2. Add platforms:
```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

3. Build the project:
```bash
npx cap sync
```

4. Open in native IDEs:
```bash
npx cap open ios     # For iOS (requires Mac)
npx cap open android # For Android
```

### Using Apache Cordova (Alternative)

1. Install Cordova:
```bash
npm install -g cordova
cordova create TetrisApp
cd TetrisApp
```

2. Add platforms:
```bash
cordova platform add ios
cordova platform add android
```

3. Copy the game files to www folder and build:
```bash
cordova build
```

## Monetization Setup

### Google AdSense Integration

1. Sign up for Google AdSense at https://www.google.com/adsense
2. Create a new ad unit
3. Replace the placeholder IDs in index.html:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_PUBLISHER_ID"></script>
```

4. Update the ad slot:
```html
data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
data-ad-slot="YOUR_AD_SLOT_ID"
```

### Ad Placement Strategy

- Banner ad at the bottom of the screen
- Interstitial ads between games
- Rewarded ads for power-ups or continues

## Performance Optimization

The game is optimized for performance with:
- Efficient particle system
- Smooth animations using requestAnimationFrame
- Responsive design with mobile-first approach
- Touch event optimization for mobile devices

## Future Enhancements

- Online leaderboard system
- Power-up system
- Achievement system
- Social sharing features
- Multiple themes
- Sound effects and background music
- Account system for progress saving

## Development

To run the game locally:
```bash
python3 -m http.server 8000 -d .
```
Then visit http://localhost:8000 in your browser.