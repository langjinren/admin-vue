import request from "@/service/request";

/**
 * 获取影片解说列表
 * @param {*} commentary_type 解说类型 0: 待审核 1：待发布 2：已发布 3：重新策划
 * @param {*} commentary_title 解说标题
 * @param {*} online_status 上线状态 0：上线 1：下线
 * @param {*} source_id 媒资id
 * @param {*} video_type 视频类型 0个人发布 1机构发布
 * @returns
 */
export const getMovieCommentaryList = async ({
	commentary_type,
	page_number,
	page_size,
	commentary_title,
	online_status,
	source_id,
	user_id,
	video_type,
	movie_id,
	phone
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/get_movie_commentary_list`,
		method: "GET",
		params: {
			commentary_type,
			page_number,
			page_size,
			commentary_title,
			online_status,
			source_id,
			user_id,
			video_type,
			movie_id,
			phone
		}
	});
};

/**
 * 获取影片解说详情
 * @param {*} commentary_id 解说id
 * @param {*} commentary_type 解说类型 0: 待审核 1：待发布 2：已发布 3：重新策划
 * @returns
 */
export const getMovieCommentaryDetail = async ({ commentary_id, commentary_type }) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/get_movie_commentary_info`,
		method: "GET",
		params: {
			commentary_id,
			commentary_type
		}
	});
};

/**
 * 首次审核电影解说
 * @param {*} commentary_id
 * @param {*} audit_status 审核状态 0未审核1审核通过
 * @param {*} associated_movie 关联影片
 * @param {*} audit_reason 原因
 * @returns
 */
export const auditMovieCommentary = async ({
	commentary_id,
	audit_status,
	user_name,
	associated_movie,
	audit_reason,
	description,
	title
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/first_audit_movie_commentary`,
		method: "POST",
		params: {
			commentary_id,
			audit_status,
			user_name,
			associated_movie,
			audit_reason,
			description,
			title
		}
	});
};

/**
 * 发布影片解说
 * @param {*} publish_status 发布状态 0：发布 1：取消发布 重新制作
 * @returns
 */
export const publishMovieCommentary = async ({
	commentary_id,
	publish_status,
	user_name,
	cancel_publish_reason
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/publish_movie_commentary`,
		method: "POST",
		params: {
			commentary_id,
			publish_status,
			user_name,
			cancel_publish_reason
		}
	});
};

/**
 * 重新策划已上线解说的关联影片信息
 * @returns
 */
export const reeditAssociatedMovie = async ({ commentary_id, user_name }) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/reedit_associated_movie`,
		method: "PUT",
		params: {
			commentary_id,
			user_name
		}
	});
};

/**
 * 保存关联影片信息并提交到待发布
 * @param {*} associated_movie 关联影片
 * @returns
 */
export const saveAssociatedMovie = async ({
	associated_movie,
	commentary_id,
	user_name,
	description,
	title
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/save_associated_movie`,
		method: "PUT",
		params: {
			associated_movie,
			commentary_id,
			user_name,
			description,
			title
		}
	});
};

/**
 * 更新解说上下线状态
 * @param {*} online_status 上线状态 0：上线 1：下线
 * @returns
 */
export const updateMovieCommentary = async ({
	commentary_id,
	online_status,
	user_name,
	offline_reason
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/update_movie_commentary_online_status`,
		method: "PUT",
		params: {
			commentary_id,
			online_status,
			user_name,
			offline_reason
		}
	});
};

/**
 * 获取解说下线记录
 * @returns
 */
export const getOfflineRecords = async ({ commentary_id }) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/get_offline_records`,
		method: "GET",
		params: {
			commentary_id
		}
	});
};

/**
 * 舍弃影片解说（打回创作者平台）
 * @returns
 */
export const giveUpCommentary = async ({ explain_id, give_up_reason, user_name }) => {
	return request({
		url: `${process.env.VUE_APP_URL_COMMENTARY}/movie_commentary/give_up_commentary`,
		method: "POST",
		params: {
			explain_id,
			give_up_reason,
			user_name
		}
	});
};
