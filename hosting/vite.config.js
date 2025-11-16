import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load env variables based on the mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      __FIREBASE_API_KEY__: JSON.stringify(env.VITE_FIREBASE_API_KEY || 'AIzaSyAmhZlFmoN1039vXiK9lo6MxwAGKN6rQfM'),
      __FIREBASE_AUTH_DOMAIN__: JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || 'cosmincoinprotocol.firebaseapp.com'),
      __FIREBASE_PROJECT_ID__: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || 'cosmincoinprotocol'),
      __FIREBASE_STORAGE_BUCKET__: JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || 'cosmincoinprotocol.firebasestorage.app'),
      __FIREBASE_MESSAGING_SENDER_ID__: JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || '787986225732'),
      __FIREBASE_APP_ID__: JSON.stringify(env.VITE_FIREBASE_APP_ID || '1:787986225732:web:82f1ca16747921a576fa11'),
      __FIREBASE_MEASUREMENT_ID__: JSON.stringify(env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MPLV4BBHTQ'),
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          login: resolve(__dirname, 'login.html'),
          register: resolve(__dirname, 'register.html'),
          404: resolve(__dirname, '404.html'),
        },
      },
      // Copy static assets
      assetsDir: 'assets',
      copyPublicDir: true,
    },
  };
});