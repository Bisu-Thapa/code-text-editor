import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (userInputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: userInputCode,
        };
      });

      // common onLoad function for css and js
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check if we have already fetched this file & if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // If it is in the cache, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        // escaped is a css snippets that can be passed into JS
        const escaped = data
          .replace(/\n/g, '') // find all new lines and fit everything in single line
          .replace(/"/g, '\\"') // find all double quotes and escape them
          .replace(/'/g, "\\'"); // find all single quotes and escape them
        const contents = `
                const style = document.createElement('style');
                style.innerText = '${escaped}';
                document.head.appendChild(style); `;

        // key will be 'args.path, value can be 'data' or entire object from 'result'
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        // store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
