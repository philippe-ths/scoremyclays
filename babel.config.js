module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transform import.meta.url → globalThis.location?.href for @powersync/web
      // Metro doesn't support import.meta syntax natively
      [
        function () {
          return {
            visitor: {
              MetaProperty(path) {
                // import.meta.url → globalThis.location?.href ?? '/'
                if (
                  path.node.meta.name === 'import' &&
                  path.node.property.name === 'meta'
                ) {
                  path.replaceWithSourceString(
                    "({ url: (typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.href : '/') })"
                  );
                }
              },
            },
          };
        },
      ],
    ],
  };
};
