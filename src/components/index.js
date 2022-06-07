import VueECharts from "vue-echarts";
import hevueImgPreview from "hevue-img-preview";

import Scrollbar from "./scrollbar";
import PageTable from "./PageTable";

function plugins(Vue) {
	// echarts 可视图表
	Vue.component("v-chart", VueECharts);
	Vue.component("scrollbar", Scrollbar);
	Vue.component("page-table", PageTable);
	Vue.use(hevueImgPreview);
}

export default plugins;
