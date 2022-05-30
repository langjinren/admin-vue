import { BaseService, Service } from "cl-admin";

@Service("base/comm")
class Common extends BaseService {
	/**
	 * 文件上传模式
	 */
	uploadMode() {
		return this.request({
			url: "/uploadMode"
		});
	}

	/**
	 * 文件上传，如果模式是 cloud，返回对应参数
	 *
	 * @returns
	 * @memberof CommonService
	 */
	upload(params) {
		return this.request({
			url: "/upload",
			method: "POST",
			params
		});
	}

	/**
	 * 用户退出
	 */
	userLogout() {
		return this.request({
			url: "/logout",
			method: "POST"
		});
	}

	/**
	 * 用户信息
	 *
	 * @returns
	 * @memberof CommonService
	 */
	userInfo() {
		return new Promise((res) => {
			return res(
				{
					"code": 1000,
					"message": "success",
					"data": {
						"id":1,
						"createTime":"2021-02-24 21:16:41",
						"updateTime":"2021-03-11 12:56:47",
						"departmentId":"1",
						"name":"超级管理员",
						"username":"admin",
						"passwordV":3,
						"nickName":"管理员",
						"headImg":"https://show.cool-admin.com/uploads//20210311/2e393000-8226-11eb-abcf-fd7ae6caeb70.png",
						"phone":"18000000000",
						"email":"team@cool-js.com",
						"remark":"拥有最高权限的用户",
						"status":1
					}
				}
			)
		})
		// return this.request({
		// 	url: "/person"
		// });
	}

	/**
	 * 用户信息修改
	 *
	 * @param {*} params
	 * @returns
	 * @memberof CommonService
	 */
	userUpdate(params) {
		return this.request({
			url: "/personUpdate",
			method: "POST",
			data: {
				...params
			}
		});
	}

	/**
	 * 权限信息
	 *
	 * @returns
	 * @memberof CommonService
	 */
	permMenu() {
		return this.request({
			url: "/permmenu"
		});
	}
}

export default Common;
