const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Read the firebase-config.js template
const configPath = path.resolve(__dirname, '../public/firebase-config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Replace placeholders with actual values, ensuring proper quoting
configContent = configContent.replace('"__FIREBASE_API_KEY__"', JSON.stringify(process.env.VITE_FIREBASE_API_KEY || 'AIzaSyAmhZlFmoN1039vXiK9lo6MxwAGKN6rQfM'));
configContent = configContent.replace('"__FIREBASE_AUTH_DOMAIN__"', JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN || 'cosmincoinprotocol.firebaseapp.com'));
configContent = configContent.replace('"__FIREBASE_PROJECT_ID__"', JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID || 'cosmincoinprotocol'));
configContent = configContent.replace('"__FIREBASE_STORAGE_BUCKET__"', JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET || 'cosmincoinprotocol.firebasestorage.app'));
configContent = configContent.replace('"__FIREBASE_MESSAGING_SENDER_ID__"', JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '787986225732'));
configContent = configContent.replace('"__FIREBASE_APP_ID__"', JSON.stringify(process.env.VITE_FIREBASE_APP_ID || '1:787986225732:web:82f1ca16747921a576fa11'));
configContent = configContent.replace('"__FIREBASE_MEASUREMENT_ID__"', JSON.stringify(process.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MPLV4BBHTQ'));

// Write the updated content back to the file
fs.writeFileSync(configPath, configContent);

console.log('Firebase config updated with environment variables');