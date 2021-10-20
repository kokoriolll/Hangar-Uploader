import hangarUploader from "./hangarUploader";

hangarUploader.install = function (Vue) {
  Vue.component(hangarUploader.name, hangarUploader)
};

export default hangarUploader;