const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude large directories from the watch list and resolver
config.resolver.blockList = [
  /audio-conversion-test\/.*/,
  /cloudflare-worker\/.*/
];

module.exports = config;
