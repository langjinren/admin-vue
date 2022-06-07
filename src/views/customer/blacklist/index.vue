<template>
	<scrollbar>
		<div class="home">
			<p v-for="index of 30" :key="index">黑名单查询</p>
		</div>
	</scrollbar>
</template>

<script>
export default {
	name: ""
};
</script>

<style lang="scss" scoped>
p {
	height: 300px;
	margin-bottom: 10px;
	background: #f9f9f9;
	padding: 10px;
}
</style>
