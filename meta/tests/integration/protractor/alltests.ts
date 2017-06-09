var requireAll = function(requireContext) {
    return requireContext.keys().map(requireContext);
}
requireAll(require.context("./", true, /^\.\/.*\.spec.ts$/));