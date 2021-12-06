import Vue from 'vue';

import { Modal, Button, Icon, Input, Spin, message, notification } from 'ant-design-vue';

Vue.use(Modal);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Spin);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;
