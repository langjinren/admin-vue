import Vue from "vue";
import VueECharts from "vue-echarts";
import { bootstrap } from "cl-admin";
import { app } from "@/config/env";
import App from "./App.vue";
import "./element";

// 路由
import router from "@/router";

// 缓存
import store from "@/store";

// echarts 可视图表
Vue.component("v-chart", VueECharts);

// 阻止显示生产模式的消息
Vue.config.productionTip = false;

Vue.directive("loadmore", {
	inserted: (el, bind, vnode) => {
		let SELECTWRAP = document.querySelector(
			`.el-select-dropdown.${bind.arg} .el-scrollbar .el-select-dropdown__wrap`
		);
		SELECTWRAP.addEventListener("scroll", function() {
			if (SELECTWRAP.scrollHeight - SELECTWRAP.clientHeight - SELECTWRAP.scrollTop <= 10) {
				bind.value();
			}
		});
	}
});

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
