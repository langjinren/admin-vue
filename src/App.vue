<template>
	<div id="app">
		<!-- <router-view /> -->
		{{$route.meta.keepAlive}}
		<keep-alive >
			<router-view v-if="$route.meta.keepAlive" />
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive" />
	</div>
</template>

<style lang="scss" src="./assets/css/index.scss"></style>
