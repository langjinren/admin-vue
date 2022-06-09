<template>
	<div class="table_wrap">
		<div class="table_content">
			<el-table
				v-loading="tableLoading"
				v-bind="$attrs"
				v-on="$listeners"
				:data="filterData"
				ref="pageTable"
				:maxHeight="`${maxHeight}px`"
			>
				<slot></slot>
			</el-table>

			<el-footer class="footer" v-if="paging">
				<el-pagination
					v-bind="$attrs"
					v-on="$listeners"
					:pager-count="5"
					:layout="layout"
					:page-sizes="pageSizes"
					:page-size="currPageSize"
					:current-page="currPage"
					:total="totalSize"
					style="float:right"
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
				></el-pagination>
			</el-footer>
		</div>
	</div>
</template>

<script>
export default {
	name: "page-table",
	props: {
		data: {
			type: Array,
			require: true,
			default: () => []
		},
		// 是否分页，默认为true，即分页。（不分页时将每页条数设置最大。）
		paging: {
			type: Boolean,
			default: true
		},
		currentPage: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 10
		},
		pageSizes: {
			type: Array,
			default: () => [10, 30, 50, 100]
		},
		layout: {
			type: String,
			default: "sizes, prev, pager, next, jumper"
		},
		// 是否开启动态列设置
		dynamicColumnSetting: {
			type: Boolean,
			default: false
		},
		// 列可见性，初始需要设置全true。列下标从 0 开始
		columnVisibles: {
			type: Array,
			default: () => []
		},
		// 初始隐藏的列的下标。列下标从 0 开始
		hidenColumnIndexs: {
			type: Array,
			default: () => []
		},
		// 总是显示的列的下标（不可隐藏的列）。列下标从 0 开始
		alwaysShowColumnIndexs: {
			type: Array,
			default: () => []
		},
		// 总是显示的列是否在checkbox中显示
		showAlwaysShowColumnInCheckbox: {
			type: Boolean,
			default: true
		},
		// 是否开启后端分页，默认为false。
		backendPaging: {
			type: Boolean,
			default: false
		},
		autoHeight: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			allData: this.data, // 全量表格数据(前端分页)
			filterData: [], // 表格展示数据
			start: 1,
			end: 1,
			totalSize: this.data.length,
			currPageSize: this.paging ? this.pageSize : Number.MAX_SAFE_INTEGER,
			currPage: this.currentPage,

			columnInfos: [], // 所有列的信息
			visibleIndexs: [], // 可见列的下标集合

			tableLoading: false, // 后端分页的loading
			checkAll: false,
			isIndeterminate: true,
			maxHeight: 200
		};
	},
	methods: {
		handleSizeChange(value) {
			this.currPage = 1;
			this.currPageSize = value;
			this.handleChange();
		},
		handleCurrentChange(value) {
			this.currPage = value;
			this.handleChange();
		},
		handleChange(reset) {
			if (reset) {
				this.currPage = 1;
			}
			if (this.backendPaging) {
				this.backendPagingFunc();
			} else {
				this.renderTable();
			}
		},
		renderTable() {
			if (this.totalSize > this.currPageSize) {
				// 总行数大于一页
				let startIndex = (this.currPage - 1) * this.currPageSize,
					endIndex = this.currPage * this.currPageSize;
				this.start = startIndex + 1;
				this.end = this.totalSize < endIndex ? this.totalSize : endIndex;
				this.filterData = this.allData.slice(startIndex, endIndex); //[start,end)
			} else if (this.totalSize > 0) {
				// 总行数小于等于一页
				this.currPage = 1;
				this.start = 1;
				this.end = this.totalSize;
				this.filterData = this.allData;
			} else {
				// 无数据
				this.currPage = 1;
				this.start = 0;
				this.end = 0;
				this.filterData = [];
			}
		},
		setData(value) {
			if (this.backendPaging) {
				this.callback(value);
			} else {
				this.allData = value;
				this.totalSize = value.length;
				this.renderTable();
			}
		},
		oprColumns(indexs, isShow) {
			let self = this;
			indexs.forEach(index => {
				self.$set(self.columnVisibles, index, isShow);
			});
		},
		backendPagingFunc() {
			this.tableLoading = true;

			this.$emit(
				"backendPagingFunc",
				this.currPage,
				this.currPageSize,
				res => this.callback(res)
			);
			this.calcMaxHeight();
		},
		callback(res) {
			this.filterData = res.data;
			this.totalSize = res.data_total;

			let startIndex = (this.currPage - 1) * this.currPageSize;
			this.start = startIndex + 1;
			this.end = this.start + this.filterData.length - 1;

			this.tableLoading = false;
		},
		setCurrentRow(row) {
			this.$refs.pageTable.setCurrentRow(row);
		},

		// 计算表格最大高度
		calcMaxHeight() {
			if (!this.autoHeight) {
				return false;
			}
			this.$nextTick(() => {
				const el = this.$el.parentNode;
				let { height = "" } = this.props || {};

				if (el) {
					let rows = document.querySelectorAll(".el-row");
					if (!rows[0] || !rows[0].isConnected) {
						return false;
					}
					let h = 55;
					for (let i = 0; i < rows.length; i++) {
						let f = true;
						if (f) {
							h += rows[i].clientHeight + 5;
						}
					}
					let h2 = el.clientHeight - h;
					this.maxHeight = h2;
				}
			});
		}
	},
	watch: {
		data() {
			if (!this.backendPaging) {
				this.setData(this.data ? this.data : []);
			}
		},
		visibleIndexs(newValue, oldValue) {
			let self = this;
			var willHideIndexs = [],
				willShowIndexs = [];

			willShowIndexs = newValue.filter(index => {
				return oldValue.indexOf(index) === -1;
			});

			willHideIndexs = oldValue.filter(index => {
				return newValue.indexOf(index) === -1;
			});

			self.oprColumns(willShowIndexs, true);
			self.oprColumns(willHideIndexs, false);
		}
	},
	mounted() {
		if (this.backendPaging) {
			this.backendPagingFunc();
		}
		window.removeEventListener("resize", function () {});
		window.addEventListener("resize", () => {
			this.calcMaxHeight();
		});
	},
	beforeUpdate() {
		let self = this;
		self.$nextTick(() => {
			self.$refs.pageTable.doLayout();
		});
	}
};
</script>

<style>
.table_wrap {
	padding-top: 10px;
}
.table_wrap .el-table {
	border-bottom: unset;
}
.table_wrap .footer {
	margin-top: 10px;
	padding: 0;
	height: 40px !important;
}
.col-setting-popover {
	min-width: 100px;
	padding: 9px 16px;
}
._popover {
	float: right;
	height: 30px;
}
.col-setting-title {
	color: #7f8b93;
	font-size: 12px;
}
.col-setting-group .el-checkbox {
	display: block;
	margin-top: 5px;
}
</style>
