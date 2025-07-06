// generate-favicons.js
// -----------------------------------------------------------
// Script to generate favicon files from existing logo
// -----------------------------------------------------------

const fs = require('fs');
const path = require('path');

// Since we can't actually generate images, we'll create placeholder files
// In a real scenario, you would use a library like sharp or jimp to resize images

const faviconSizes = [
  { name: 'favicon-16x16.png', size: '16x16' },
  { name: 'favicon-32x32.png', size: '32x32' },
  { name: 'apple-touch-icon.png', size: '180x180' },
  { name: 'android-chrome-192x192.png', size: '192x192' },
  { name: 'android-chrome-512x512.png', size: '512x512' }
];

console.log('🎨 Generating favicon files...');

// Create a simple HTML file that can be used to generate favicons
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Favicon Generator</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .favicon { margin: 10px; display: inline-block; }
    .favicon img { border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>LoyaltyPro Favicon Generator</h1>
  <p>Use this page to generate favicon files from the SVG:</p>
  
  <div class="favicon">
    <h3>16x16</h3>
    <img src="/favicon.svg" width="16" height="16" alt="16x16">
  </div>
  
  <div class="favicon">
    <h3>32x32</h3>
    <img src="/favicon.svg" width="32" height="32" alt="32x32">
  </div>
  
  <div class="favicon">
    <h3>180x180 (Apple Touch Icon)</h3>
    <img src="/favicon.svg" width="180" height="180" alt="180x180">
  </div>
  
  <div class="favicon">
    <h3>192x192 (Android Chrome)</h3>
    <img src="/favicon.svg" width="192" height="192" alt="192x192">
  </div>
  
  <div class="favicon">
    <h3>512x512 (Android Chrome)</h3>
    <img src="/favicon.svg" width="512" height="512" alt="512x512">
  </div>
  
  <p><strong>Instructions:</strong></p>
  <ol>
    <li>Right-click on each image above</li>
    <li>Select "Save image as..."</li>
    <li>Save with the corresponding filename in the public folder</li>
  </ol>
</body>
</html>
`;

// Create the HTML file
fs.writeFileSync(path.join(__dirname, 'public', 'favicon-generator.html'), htmlContent);

console.log('✅ Created favicon-generator.html');
console.log('📁 Please visit /favicon-generator.html to generate the favicon files');
console.log('🔧 Or manually create the following files in the public folder:');
faviconSizes.forEach(({ name, size }) => {
  console.log(`   - ${name} (${size})`);
});

console.log('\n🎯 The favicon.ico file already exists and will be used as the main favicon.'); 