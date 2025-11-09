// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Suppress warnings for non-route files
config.resolver.blockList = [
  ...config.resolver.blockList || [],
];

// These patterns help Expo Router understand which files are NOT routes
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
];

module.exports = config;

