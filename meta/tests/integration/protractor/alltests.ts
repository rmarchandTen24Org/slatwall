/// <reference path="../../../../org/Hibachi/client/typings/webpack/index.d.ts" />
/// <reference path="../../../../org/Hibachi/client/typings/webpack-env/index.d.ts" />
var requireAll = function(requireContext) {
    return requireContext.keys().map(requireContext);
}
requireAll(require.context("./", true, /^\.\/.*\.spec.ts$/));