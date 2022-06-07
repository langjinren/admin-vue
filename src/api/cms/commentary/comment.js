import request from "@/service/request";

/**
 * 评论列表查询
 * @param {*} audit_status 审核状态 0未审核1审核通过
 * @param {*} inform_status 举报状态 0未举报1已举报
 * @param {*} video_name 视频名称
 * @returns
 */
export const getCommentList = async ({
	page,
	size,
	user_id,
	video_id,
	audit_status,
	inform_status,
	video_name
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/small/video/selectForPageList`,
		method: "GET",
		params: {
			page,
			size,
			user_id,
			video_id,
			audit_status,
			inform_status,
			video_name
		}
	});
};

/**
 * 插入评论
 * @param {*} data
 *  {
      "user_id": "123456",
      "video_id": "99iiw9wi87ujuu78777", //视频id
      "video_name": "测试", 
      "content": "猴赛雷", //评论内容
      "images_url": ["http:wwww.baidu.com"], //图片地址
      "praise_count": 1, //评论数量
      "audit_status": 0,
      "share_count": 4,
      "inform_status": 0,
      "reply": [{"content": "滚" //评论内容}],
      "reply_count": 0,
      "adult_message": "通过",
      "adult_person": "111"
 *  }
 * @returns
 */
export const insertComment = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/small/video/save`,
		method: "POST",
		data
	});
};

/**
 * 审核/举报评论
 * @param {*} id
 * @param {*} audit_status 审核状态 0未审核1审核通过
 * @param {*} inform_status 举报状态 0未举报1已举报
 * @returns
 */
export const auditOrReportComment = async ({ id, audit_status, inform_status, audit_message }) => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/small/video/updateById`,
		method: "PUT",
		data: {
			id,
			audit_status,
			inform_status,
			audit_message
		}
	});
};

/**
 * 回复列表
 * @param {*} params
 * @returns
 */
export const getReplyCommentList = async ({
	page,
	size,
	user_id,
	video_id,
	audit_status,
	inform_status,
	video_name
}) => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/video/comment/response/selectForPage`,
		method: "GET",
		params: {
			page,
			size,
			user_id,
			video_id,
			audit_status,
			inform_status,
			video_name
		}
	});
};

/**
 * 回复审核 
 * @param {*} data
 * [{"id": ["62398ca3e80afab7c3a8afb3"] //数据id集合list},
   {
     "audit_status": 0, //审核状态0 未审核 1审核通过 
     "inform_status": 0, //举报状态0 无效举报 有效举报 
     "audit_message": "审核不通过" //通过审核原因
    }]
 * @returns
 */
export const auditOrReportReplyComment = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/video/comment/response/updateByCondition`,
		method: "PUT",
		data
	});
};

/**
 * 评论批量审核
 * @param {*} data
 * [{"id": ["62383cfb511bc294117aebc2","62383d0b511bc294117aebc3"] //数据id集合list},
   {
     "audit_status": 0, //审核状态0 未审核 1审核通过 
     "inform_status": 0, //举报状态0 无效举报 有效举报 
     "audit_message": "审核不通过" //通过审核原因
    }]
 * @returns
 */
export const auditOrReportLotComment = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/small/video/updateByCondition`,
		method: "PUT",
		data
	});
};

/**
 * 插入回复
 * @param {*} data
   {
      "user_id": "123456", //用户id
      "video_id": "99iiw9wi87ujuu78777", //视频id
      "video_name": "测试", //视频名称
      "reply_content": "猴赛雷",
      "reply_user_id": "123456",
      "comment_user_id": "654321",
      "comment_id": "623834dc511bc294117aebbe",
      "audit_type": 1,
      "reply_status": 1,
      "audit_status": 0, //审核状态0 未审核 1审核通过
      "share_count": 4,
      "inform_status": 0, //举报状态0未举报1已举报
      "adult_message": "通过",
      "adult_person": "111"
    }
 * @returns
 */
export const insertReply = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/video/comment/response/save`,
		method: "POST",
		data
	});
};

/**
 * 新增禁言
 * @param {*} params
 * {
    "user_id": "7952838", //用户id
    "user_phone": "1234545456778", //用户手机号
    "banned_message": "test", //用户禁言原因
    "banned_time": 123456 //用户禁言时间 单位秒
  }
 * @returns
 */
export const addBanned = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/banned`,
		method: "POST",
		data
	});
};

/**
 * 修改禁言
 * @param {*} params
 * {
    "user_id": "7952838", //用户id
    "user_phone": "1234545456778", //用户手机号
    "banned_message": "test", //用户禁言原因
    "banned_time": 123456 //用户禁言时间 单位秒
  }
 * @returns
 */
export const amendBanned = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/banned`,
		method: "POST",
		data
	});
};

/**
 * 禁言列表
 * @param {*} params
 * {
    "user_id": "", //用户id
    "is_banned": "", //是否只查禁言用户 否 0 所有 1 禁言用户  不传默认所有
    "sort": "", //用于排序
    "page_num": "0", //从0开始
    "page_size": "10" //每页数量
  }
 * @returns
 */
export const getBannedlist = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_BASE}/movie_comment/v1.0/banned/list`,
		method: "POST",
		data
	});
};
