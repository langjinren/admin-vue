<template>
	<el-popover
		placement="bottom-end"
		min-width="120"
		trigger="click"
		:ref="`popoverMovieCommentaryRef`"
	>
		<el-button slot="reference" type="warning">
			重新策划
		</el-button>
		<p class="pop_title pop_title_tip">重新策划解说</p>
		<el-form
			:model="movieSelect"
			label-width="110px"
			label-position="left"
			:rules="movieSelectRules"
			ref="movieSelectRef"
			style="padding: 10px 0 1 10px; width: 500px;  "
		>
			<el-form-item label="解说选择" :key="1" prop="commentary_id">
				<el-select
					v-model="movieSelect.commentary_id"
					placeholder="输入解说名称 进行搜索"
					filterable
					no-data-text="暂无匹配数据"
					no-match-text="暂无匹配数据"
					remote
					reserve-keyword
					:remote-method="toGetMovieCommentaryList"
					@focus="toGetMovieCommentaryList('', false)"
					v-loadmore:[movieSelect.direction]="loadMoreMovie"
					popper-class="movie_commentar_list"
					style="width: 100%; "
				>
					<el-option
						v-for="item in movieSelect.movieCommentaryList"
						:key="item.commentary_id"
						:label="item.title"
						:value="item.commentary_id"
					>
						<span style="float: left">{{ item.title }}</span>
						<span class="sel_description">{{ item.description }}</span>
					</el-option>
					<div
						v-if="movieSelect.loading"
						style="width: 100; text-align: center; color: #9f9f9f; font-size: 13px"
					>
						加载中...
					</div>
					<div
						v-if="movieSelect.loadAll"
						style="width: 100; text-align: center; color: #9f9f9f; font-size: 13px"
					>
						加载完毕
					</div>
				</el-select>
			</el-form-item>
			<el-button
				type="primary"
				style="float: right; margin-left: 10px; "
				@click="handleAudit()"
				>确认</el-button
			>
			<el-button style="float: right; " @click="$refs[`popoverMovieCommentaryRef`].doClose()"
				>取消</el-button
			>
		</el-form>
	</el-popover>
</template>

<script>
import { getMovieCommentaryList, reeditAssociatedMovie } from "@/api/cms/commentary/commentary";
export default {
	name: "AddCommentary",
	props: ["userName", "onSuccess"],
	data() {
		return {
			movieSelect: {
				commentary_id: "",
				commentary_title: "",
				page_number: 1,
				page_size: 10,
				movieCommentaryList: [],
				loading: false,
				direction: "movie_commentar_list",
				loadAll: false,
				commentary_type: 2
			},
			movieSelectRules: {
				commentary_id: [{ required: true, message: "请选择解说", trigger: "blur" }]
			}
		};
	},
	methods: {
		loadMoreMovie() {
			let { loading, loadAll } = this.movieSelect;
			if (loading || loadAll) {
				return;
			}
			this.toGetMovieCommentaryList("", false);
		},
		cancelSaveMovie() {
			this.isEdit = false;
			this.$set(this.movieSelect, "commentary_id", "");
			this.$set(this.movieSelect, "page_number", 1);
			this.$set(this.movieSelect, "movieCommentaryList", []);
			this.$set(this.movieSelect, "loadAll", false);
		},
		toGetMovieCommentaryList(commentary_title, flag) {
			if (flag == undefined) {
				this.$set(this.movieSelect, "commentary_title", commentary_title);
			}
			if (this.loading) {
				return;
			}
			if (commentary_title != "") {
				this.$set(this.movieSelect, "page_number", 1);
				this.$set(this.movieSelect, "movieCommentaryList", []);
				this.$set(this.movieSelect, "loadAll", false);
			}
			this.$set(this.movieSelect, "loading", true);
			getMovieCommentaryList({
				...this.movieSelect
			}).then(res => {
				if (res.code == "000000") {
					let { page_number, movieCommentaryList, page_size } = this.movieSelect;
					if (res.content.data.length > 0) {
						if (page_number == 1) {
							console.log(res.content.data);
							this.$set(this.movieSelect, "movieCommentaryList", res.content.data);
						} else {
							let newDate = [...movieCommentaryList, ...res.content.data];
							let map = new Map();
							for (let item of newDate) {
								if (!map.has(item.commentary_id)) {
									map.set(item.commentary_id, item);
								}
							}
							this.$set(this.movieSelect, "movieCommentaryList", [...map.values()]);
						}
						if (res.content.data.length < page_size) {
							this.$set(this.movieSelect, "loadAll", true);
						}
						this.$set(this.movieSelect, "page_number", page_number + 1);
					}
				} else {
				}
				this.$set(this.movieSelect, "loading", false);
			});
		},
		handleAudit() {
			this.$refs["movieSelectRef"].validate(valid => {
				if (valid) {
					let { commentary_id } = this.movieSelect;
					reeditAssociatedMovie({
						commentary_id,
						user_name: this.userName
					}).then(res => {
						if (res.code == "000000") {
							this.$refs[`popoverMovieCommentaryRef`] &&
								this.$refs[`popoverMovieCommentaryRef`].doClose();
							this.$message.success("操作成功");
							this.onSuccess && this.onSuccess();
							this.movieSelect = Object.assign(
								{},
								{
									commentary_id: "",
									commentary_title: "",
									page_number: 1,
									page_size: 10,
									movieCommentaryList: [],
									loading: false,
									direction: "movie_commentar_list",
									loadAll: false,
									commentary_type: 2
								},
								{}
							);
						} else {
							this.$message.warning(res.message);
						}
					});
				} else {
					return false;
				}
			});
		}
	}
};
</script>

<style>
.sel_description {
	float: right;
	color: rgb(132, 146, 166);
	font-size: 12px;
	display: inline-block;
	max-width: 250px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
