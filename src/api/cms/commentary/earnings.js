import request from "@/service/request";

/**
 * 分页获取收益规则
 * @returns
 */
export const getSelByCondition = async (data, params) => {
	return request({
		url: `${process.env.VUE_APP_URL_MOVIE}/cms/commentary_income_rule/sel_by_condition?page_number=${data.page_number}&page_size=${data.page_size}`,
		method: "POST",
		data: {
			...params
		}
	});
};

/**
 * 增加收益规则
 * @returns
 */
export const getAddCommentaryIncomeRule = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_MOVIE}/cms/commentary_income_rule/add_commentary_income_rule`,
		method: "POST",
		data
	});
};

/**
 * 更新收益规则
 * @returns
 */
export const getUpdateCommentaryIncomeRule = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_MOVIE}/cms/commentary_income_rule/update_commentary_income_rule`,
		method: "PUT",
		data
	});
};

/**
 * 删除收益规则
 * @returns
 */
export const delByRuleId = async data => {
	return request({
		url: `${process.env.VUE_APP_URL_MOVIE}/cms/commentary_income_rule/del_by_rule_id?id=${data}`,
		method: "DELETE",
		data: {}
	});
};
