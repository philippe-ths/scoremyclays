const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// PowerSync web uses `import.meta.url` for worker paths.
// Metro doesn't support import.meta, so we replace it with a shim.
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Replace `import.meta.url` in PowerSync web modules so Metro can bundle them
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
};

module.exports = config;
