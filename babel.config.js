module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@/navigation': './src/navigation',
            '@/components': './src/components',
            '@/context': './src/context',
            '@/constants': './src/constants',
            '@/types': './src/types',
            '@/hooks': './src/hooks',
            '@/screens': './src/screens',
            '@/validators': './src/validators',
            '@/firebase': './src/firebase',
            '@/assets': './assets',

          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowlist: [
            'FIREBASE_API_KEY', 
            'FIREBASE_AUTH_DOMAIN', 
            'FIREBASE_PROJECT_ID', 
            'FIREBASE_STORAGE_BUCKET', 
            'FIREBASE_MESSAGING_SENDER_ID', 
            'FIREBASE_APP_ID', 
            'FIREBASE_MEASUREMENT_ID', 
            'TEXT_TO_TEST'
          ],
        },
      ],
    ],
  };
};
