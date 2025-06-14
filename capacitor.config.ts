
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.73910db285454264b6ef3fe39633f4b5',
  appName: 'dads-bluetooth-app',
  webDir: 'dist',
  server: {
    url: 'https://73910db2-8545-4264-b6ef-3fe39633f4b5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothManager: {
      requestPermissions: true,
      autoConnect: true
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#1e293b",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#3b82f6",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
