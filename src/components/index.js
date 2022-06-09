import VueECharts from "vue-echarts";
import hevueImgPreview from "hevue-img-preview";

import Scrollbar from "./scrollbar";
import DynamicTable from "./table";

function plugins(Vue) {
	// echarts 可视图表
	Vue.component("v-chart", VueECharts);
	Vue.component("scrollbar", Scrollbar);
	Vue.component("dynamic-table", DynamicTable);
	Vue.use(hevueImgPreview);
}

export default plugins;
