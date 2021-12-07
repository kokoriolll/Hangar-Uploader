import HangarUploader from './HangarUploader/index';
import '../packages/lazy_use';
const components = [HangarUploader];

const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;

  components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  HangarUploader
};
