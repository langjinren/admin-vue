<template>
	<div>
		<el-row :gutter="20" v-if="params.commentary_type != 2">
			<el-col :span="6">
				<el-input
					v-model.trim="params.phone"
					placeholder="发布者手机号"
					prefix-icon="el-icon-search"
					clearable
				/>
			</el-col>
			<el-col :span="6">
				<el-input
					v-model.trim="params.commentary_title"
					placeholder="解说标题"
					prefix-icon="el-icon-search"
					clearable
				/>
			</el-col>
			<el-col :span="6">
				<el-select
					style="width: 100%"
					clearable
					v-model="params.video_type"
					placeholder="视频类型"
				>
					<el-option label="全部" value="" />
					<el-option label="个人发布" :value="0" />
					<el-option label="机构发布" :value="1" />
				</el-select>
			</el-col>
			<el-col :span="params.commentary_type == 2 ? 6 : 6">
				<el-button type="success" @click="onSearch">搜索</el-button>
				<el-button @click="onReset">重置</el-button>
				<el-button
					class="fr"
					icon="el-icon-refresh-right"
					circle
					@click="toGetMovieCommentaryList"
					style="margin-right: 10px;"
				></el-button>
			</el-col>
		</el-row>

		<el-row :gutter="20" v-if="params.commentary_type == 2">
			<el-col :span="6">
				<el-input
					v-model.trim="params.phone"
					placeholder="发布者手机号"
					prefix-icon="el-icon-search"
					clearable
				/>
			</el-col>
			<el-col :span="6">
				<el-input
					v-model.trim="params.commentary_title"
					placeholder="解说标题"
					prefix-icon="el-icon-search"
					clearable
				/>
			</el-col>
			<el-col :span="6" v-if="params.commentary_type == 2">
				<el-select
					v-model="movieSelect.movie"
					value-key="movie_id"
					placeholder="输入影片名称 选择影片进行搜索"
					filterable
					no-data-text="暂无匹配影片数据"
					no-match-text="暂无匹配影片数据"
					remote
					reserve-keyword
					:remote-method="toGetMovieList"
					v-loadmore:[movieSelect.direction]="loadMoreMovie"
					popper-class="index"
					style="width: 100%; "
				>
					<el-option
						v-for="item in movieSelect.movieList"
						:key="item.movie_id"
						:label="item.movie_name"
						:value="item"
					>
						<span style="float: left">{{ item.movie_name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{
							item.movie_id
						}}</span>
					</el-option>
					<div
						v-if="movieSelect.movieLoading"
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
			</el-col>
		</el-row>
		<el-row :gutter="20" style="margin-top: 10px; " v-if="params.commentary_type == 2">
			<el-col :span="6">
				<el-select
					style="width: 100%"
					clearable
					v-model="params.video_type"
					placeholder="视频类型"
				>
					<el-option label="全部" value="" />
					<el-option label="个人发布" :value="0" />
					<el-option label="机构发布" :value="1" />
				</el-select>
			</el-col>
			<el-col :span="6">
				<el-select
					style="width: 100%"
					clearable
					v-model="params.online_status"
					placeholder="上线状态"
				>
					<el-option label="全部" value="" />
					<el-option label="上线" :value="0" />
					<el-option label="下线" :value="1" />
				</el-select>
			</el-col>
			<el-col :span="12">
				<el-button type="success" @click="onSearch">搜索</el-button>
				<el-button @click="onReset">重置</el-button>
				<el-button
					class="fr"
					icon="el-icon-refresh-right"
					circle
					@click="toGetMovieCommentaryList"
					style="margin-right: 10px;"
				></el-button>
			</el-col>
		</el-row>

		<el-table
			:data="tableData"
			v-loading="loading"
			border
			height="90%"
			element-loading-background="rgba(0, 0, 0, .1)"
			style="width: 100%; margin-top: 10px; "
		>
			<el-table-column
				prop="id"
				label="#"
				key="1"
				width="50"
				v-if="params.commentary_type == 0"
			/>
			<el-table-column
				prop="original_id"
				label="#"
				key="2"
				width="50"
				v-if="params.commentary_type != 0"
			/>
			<el-table-column prop="phone" label="发布者手机号" width="120" key="4" />
			<el-table-column
				prop="video_nickname"
				label="原始发布者昵称"
				key="5"
				v-if="params.commentary_type != 0"
			/>
			<el-table-column
				prop="nickname"
				label="原始发布者昵称"
				key="55"
				v-if="params.commentary_type == 0"
			/>

			<el-table-column prop="title" label="标题" key="6" v-if="params.commentary_type != 0" />
			<el-table-column
				prop="description"
				label="描述"
				key="7"
				v-if="params.commentary_type != 0"
				min-width="220"
			/>

			<el-table-column
				prop="video_title"
				label="原始标题"
				key="666"
				v-if="params.commentary_type == 0"
			/>
			<el-table-column
				prop="video_description"
				label="原始描述"
				key="777"
				v-if="params.commentary_type == 0"
				min-width="220"
			/>

			<el-table-column
				prop="movie_id"
				label="影片"
				key="77"
				min-width="90"
				v-if="params.commentary_type != 0"
			>
				<template slot-scope="scope">
					<p v-if="scope.row.movie_id" class="p0 m0">id: {{ scope.row.movie_id }}</p>
					<p v-if="scope.row.movie_name" class="p0 m0">
						片名: 《{{ scope.row.movie_name }}》
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="video_type" label="发布类型" key="8" width="90">
				<template slot-scope="scope">
					<el-tag effect="dark" :type="scope.row.video_type == 1 ? 'warning' : 'primary'">
						{{ scope.row.video_type == 1 ? "机构发布" : "个人发布" }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column
				prop="online_status"
				label="上线类型"
				v-if="params.commentary_type == 2"
				key="9"
			>
				<template slot-scope="scope">
					<el-button
						:type="scope.row.online_status == 0 ? 'success' : 'primary'"
						style="padding: 3px 6px;"
						@click="toAudit(scope.row)"
					>
						{{ scope.row.online_status == 0 ? "上线" : "下线" }}
					</el-button>
					<span
						v-if="scope.row.online_status == 1"
						style="margin-left: 5px; cursor: pointer;"
						@click="toGetOfflineList(scope.row)"
						>查看<i class="el-icon-d-arrow-right"></i
					></span>
				</template>
			</el-table-column>
			<el-table-column prop="title_page_url" label="封面" key="10" width="110">
				<template slot-scope="scope">
					<el-image
						v-if="
							scope.row.title_page_url != null && scope.row.title_page_url.length > 0
						"
						:src="scope.row.title_page_url"
						@click="previewImgMore(0, [scope.row.title_page_url])"
						fit="contain"
					/>
					<span v-else>
						无图片
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" key="11" />
			<el-table-column
				label="操作"
				align="center"
				:width="params.commentary_type == 0 ? 280 : 130"
				key="12"
			>
				<template slot-scope="scope">
					<el-button
						v-if="params.commentary_type == 0"
						type="primary"
						@click="jumpOtherPage('video', scope.row.source_id)"
						>视频结果</el-button
					>
					<el-button
						v-if="params.commentary_type == 0"
						type="primary"
						style="margin: 0 5px 0 5px; "
						@click="jumpOtherPage('audio', scope.row.source_id)"
						>音频结果</el-button
					>
					<commentary-detail
						:data="scope.row"
						:user-name="user_name"
						:commentary-type="params.commentary_type"
						:on-success="toGetMovieCommentaryList"
					/>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="下线操作记录" :visible.sync="visibleDialog">
			<el-table :data="offlineList" border>
				<el-table-column type="index" label="#" />
				<el-table-column prop="operate_reason" label="原因" />
				<el-table-column prop="operate_user" label="操作人" width="100" />
				<el-table-column prop="create_time" label="创建时间" width="150" />
			</el-table>
		</el-dialog>

		<lang-pagination
			:total="total"
			:pageSize="params.page_size"
			:currentPage="params.page_number"
			:sizeChange="sizeChange"
			:currentChange="currentChange"
			:pagination="toGetMovieCommentaryList"
		/>
	</div>
</template>

<script>
import {
	getMovieCommentaryList,
	updateMovieCommentary,
	getOfflineRecords
} from "@/api/cms/commentary/commentary";
import { getMovieList } from "@/api/cms/commentary/movie";
import { Screen } from "@/mixins";

import LangPagination from "@/components/Pagination.vue";
import CommentaryDetail from "./components/Detail.vue";
import CommentaryAdd from "./components/Add.vue";

export default {
	name: "MovieCommentary",
	components: {
		LangPagination,
		CommentaryDetail,
		CommentaryAdd
	},
	mixins: [Screen],
	data() {
		return {
			loading: false,
			total: 0,
			tableData: [],
			params: {
				page_number: 1,
				page_size: 10,
				commentary_title: "",
				online_status: "",
				source_id: "",
				phone: "",
				video_type: "",
				movie_id: "",
				commentary_type: 0
			},
			selectAll: false,
			movieSelect: {
				movie: "",
				movie_id: "",
				movie_name: "",
				page_number: 1,
				page_size: 10,
				movieList: [],
				movieLoading: false,
				direction: "index",
				loadAll: false
			},
			visibleDialog: false,
			offlineList: [],
			user_name: "test"
		};
	},
	methods: {
		previewImgMore(index, imgList) {
			this.$hevueImgPreview({
				multiple: true,
				imgList,
				nowImgIndex: index,
				keyboard: true
			});
		},
		jumpOtherPage(type, source_id) {
			window.open(
				`${process.env.VUE_APP_PAGE}/plan_media/to_media_${type}_result?sourceId=${source_id}`
			);
		},
		switchSelectAll(status) {
			let self = this;
			let arr = [];
			self.tableData.map(item => {
				if (item.audit_status == 0) {
					if (status) {
						self.$set(item, "select", true);
						arr.push(item);
						return;
					} else {
						self.$set(item, "select", false);
						arr.push(item);
					}
				}
			});
		},
		onSearch() {
			this.$set(this.params, "page", 0);
			this.tableData = [];
			this.toGetMovieCommentaryList();
		},
		onReset() {
			this.params = Object.assign(
				{},
				{
					page_number: 1,
					page_size: 10,
					commentary_title: "",
					online_status: "",
					source_id: "",
					phone: "",
					video_type: "",
					movie_id: ""
				},
				{}
			);
			this.$set(this.movieSelect, "movie", "");
			this.$set(this.movieSelect, "movieList", []);
			this.toGetMovieCommentaryList();
		},
		sizeChange(pageSize) {
			this.$set(this.params, "page_size", pageSize);
			this.toGetMovieCommentaryList();
		},
		currentChange(currentChange) {
			this.$set(this.params, "page_number", currentChange);
			this.toGetMovieCommentaryList();
		},
		toGetMovieCommentaryList() {
			this.loading = true;
			let commentary_type = this.$route.path.substring(1).split("/")[2] || 0;
			this.$set(this.params, "commentary_type", commentary_type);
			let { movie: { movie_id = "" } = {} } = this.movieSelect;
			getMovieCommentaryList({
				...this.params,
				movie_id
			}).then(res => {
				if (res.code == 0) {
					this.tableData = res.content.data;
					this.total = res.content.data_total;
				} else {
					this.tableData = [];
					this.total = 0;
				}
				this.loading = false;
			});
		},
		toAudit({ commentary_id, online_status }) {
			let self = this;
			if (online_status == 0) {
				self.$prompt("请输入下线原因", "请确认是否下线", {
					confirmButtonText: "确认下线",
					cancelButtonText: "取消",
					inputPattern: /\S/,
					inputErrorMessage: "请输入下线原因"
				}).then(({ value }) => {
					updateMovieCommentary({
						offline_reason: value,
						online_status: 1,
						commentary_id: commentary_id
					}).then(res => {
						if (res.code == "000000") {
							this.$message.success("操作成功");
							this.toGetMovieCommentaryList();
						} else {
							this.$message.error(res.message);
						}
					});
				});
			} else {
				self.$msgbox({
					title: "请确认是否上线",
					showCancelButton: true,
					confirmButtonText: "确认上线",
					cancelButtonText: "取消"
				}).then(action => {
					updateMovieCommentary({
						offline_reason: "",
						online_status: 0,
						commentary_id: commentary_id,
						user_name: this.user_name
					}).then(res => {
						if (res.code == "000000") {
							this.$message.success("操作成功");
							this.toGetMovieCommentaryList();
						} else {
							this.$message.error(res.message);
						}
					});
				});
			}
		},
		loadMoreMovie() {
			let { movieLoading, loadAll } = this.movieSelect;
			if (movieLoading || loadAll) {
				return;
			}
			this.toGetMovieList("", false);
		},
		toGetMovieList(movie_name, flag) {
			if (flag == undefined) {
				this.$set(this.movieSelect, "movie_name", movie_name);
			}
			if (this.movieLoading) {
				return;
			}
			if (movie_name != "") {
				this.$set(this.movieSelect, "page_number", 1);
				this.$set(this.movieSelect, "movieList", []);
				this.$set(this.movieSelect, "loadAll", false);
			}
			if (this.movieSelect.movie_name == "") {
				this.$set(this.movieSelect, "page_number", 1);
				this.$set(this.movieSelect, "movieList", []);
				this.$set(this.movieSelect, "loadAll", false);
				return;
			}
			this.$set(this.movieSelect, "movieLoading", true);
			getMovieList({
				...this.movieSelect
			}).then(res => {
				let { page_number, movieList, page_size } = this.movieSelect;
				if (res.total_size > 0) {
					if (page_number == 1) {
						this.$set(this.movieSelect, "movieList", res.movie_list);
					} else {
						let newDate = [...movieList, ...res.movie_list];
						let map = new Map();
						for (let item of newDate) {
							if (!map.has(item.movie_id)) {
								map.set(item.movie_id, item);
							}
						}
						this.$set(this.movieSelect, "movieList", [...map.values()]);
					}
					if (res.movie_list.length < page_size) {
						this.$set(this.movieSelect, "loadAll", true);
					}
					this.$set(this.movieSelect, "page_number", page_number + 1);
				}
				this.$set(this.movieSelect, "movieLoading", false);
			});
		},
		toGetOfflineList({ commentary_id }) {
			getOfflineRecords({
				commentary_id
			}).then(res => {
				if (res.code == 0) {
					this.offlineList = res.content;
					this.visibleDialog = true;
				}
			});
		}
	},
	mounted() {
		this.onSearch();
	},
	watch: {
		$route(to, from) {
			if (to.path.indexOf("/cms/commentary") >= 0) {
				this.onSearch();
			}
		}
	}
};
</script>
