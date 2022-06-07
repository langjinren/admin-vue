<template>
	<el-pagination
		:total="total"
		:page-sizes="[10, 20, 50, 100]"
		:current-page="currentPage"
		:page-size="pageSize"
		layout="total, sizes, prev, pager, next, jumper"
		@size-change="sizeChange"
		@current-change="currentChange"
		@pagination="pagination"
		style="margin-top: 10px; float: right;"
	>
	</el-pagination>
</template>

<script>
export default {
	name: "Pagination",
	props: {
		total: {
			type: Number,
			default: 0
		},
		currentPage: {
			type: Number,
			default: 0
		},
		pageSize: {
			type: Number,
			default: 0
		},
		sizeChange: {
			type: Function,
			default: function() {}
		},
		currentChange: {
			type: Function,
			default: function() {}
		},
		pagination: {
			type: Function,
			default: function() {}
		}
	}
};
</script>
