const { getDefaultConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add support for .cjs files
defaultConfig.resolver.assetExts.push("cjs");

// Add better error handling
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Add better source map support
defaultConfig.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = defaultConfig;
