import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.marinefrost.app',
  appName: 'MarineFrost',
  webDir: 'out', // Will be used when static export is available
  server: {
    // For development with live reload, uncomment the following and run `npm run dev` first:
    // url: 'http://YOUR_LOCAL_IP:3000',
    // cleartext: true, // Required for Android to allow HTTP
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0a0a',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0a0a0a',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
};

export default config;
