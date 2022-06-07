import Vue from "vue";
import { bootstrap } from "cl-admin";
import { app } from "@/config/env";
import App from "./App.vue";
import plugins from "@/components";
import "./element";

// 路由
import router from "@/router";

// 缓存
import store from "@/store";

//注意必须在构建Vue实例之前就将需要的组件注册进去
Vue.use(plugins);

// 阻止显示生产模式的消息
Vue.config.productionTip = false;

// 配置
bootstrap()
	.then(() => {
		// 加载菜单、用户信息
		store.dispatch("appLoad");

		new Vue({
			router,
			store,
			render: h => h(App)
		}).$mount("#app");
	})
	.catch(err => {
		console.error(`${app.name} 启动失败`, err);
	});
