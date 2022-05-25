import Crud from "cl-admin-crud";

export default {
	modules: [
		// 基础模块
		"base",
		// 文件上传
		{
			name: "upload",
			options: {
				icon: "el-icon-picture",
				text: "选择图片"
			}
		},
		{
			name: "crud",
			value: Crud,
			options: {
				crud: {
					dict: {
						sort: {
							prop: "order",
							order: "sort"
						}
					}
				}
			}
		},
		// 客服聊天
		"chat",
		// 复制指令
		"copy"
	]
};
