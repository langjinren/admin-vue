import store from "store";
import { getUrlParam } from "cl-admin/utils";

// 路由模式
export const routerMode = "history";

// 开发模式
export const isDev = process.env.NODE_ENV == "development";

// 阿里字体图标库 https://at.alicdn.com/t/**.css
export const iconfontUrl = "";

export const baseUrl = "";

export const host = "";

// 程序配置参数
export const app = store.get("__app__") || {
	name: "Pumpkin Doras",

	conf: {
		showAMenu: true, // 是否显示一级菜单栏
		showRouteNav: false, // 是否显示路由导航栏
		showProcess: true, // 是否显示页面进程栏
		customMenu: true // 自定义菜单
	},

	theme: {
		color: "", // 主题色
		url: "" // 主题样式地址
	}
};

// 自定义菜单列表
export const menuList = [
	{
		// 菜单图标
		icon: "icon-workbench",
		// 菜单名称
		name: "CMS",
		// 菜单路由
		router: "/cms",
		// 菜单类型，0：目录，1：菜单，2：权限
		type: 0,
		// 子菜单
		children: [
			{
				icon: "icon-workbench",
				name: "解说管理",
				router: "/cms/commentary",
				type: 0,
				meta: {
					keepAlive: 0,
					label: "解说管理"
				},
				// 菜单文件路径
				children: [
					{
						icon: "icon-workbench",
						name: "解说资源池",
						router: "/cms/commentary/3/:id",
						type: 1,
						viewPath: "views/cms/commentary/index.vue",
						// viewPath: "http://dev.doras.vcinema.cn:8111/movie_commentary/#/commentary?commentary_type=2&user_id=1&user_name=admin",
						meta: {
							keepAlive: 0,
							label: "解说管理"
						}
					},
					{
						icon: "icon-favor",
						name: "解说策划",
						router: "/cms/commentary/0",
						type: 1,
						viewPath: "views/cms/commentary/index.vue",
						meta: {
							keepAlive: 0,
							label: "解说管理"
						}
					},
					{
						icon: "icon-workbench",
						name: "待发布解说",
						router: "/cms/commentary/1",
						type: 1,
						viewPath: "views/cms/commentary/index.vue",
						meta: {
							keepAlive: 0,
							label: "解说管理"
						}
					}
				]
			},
			{
				icon: "icon-workbench",
				name: "解说管理",
				router: "/cms/commentary/2",
				type: 0,
				children: [
					{
						icon: "icon-workbench",
						name: "已发布解说",
						router: "/cms/commentary/2",
						type: 1,
						viewPath: "views/cms/commentary/index.vue"
					}
				]
			}
		]
	},
	{
		// 菜单图标
		icon: "icon-workbench",
		// 菜单名称
		name: "客服系统",
		// 菜单路由
		router: "/customer",
		// 菜单类型，0：目录，1：菜单，2：权限
		type: 0,
		// 子菜单
		children: [
			{
				icon: "icon-workbench",
				name: "黑名单管理",
				router: "/customer/blacklist",
				type: 0,
				// 菜单文件路径
				children: [
					{
						icon: "icon-workbench",
						name: "黑名单查询",
						router: "/customer/blacklist",
						type: 1,
						viewPath: "views/customer/blacklist/index.vue"
					}
				]
			},
			{
				icon: "icon-workbench",
				name: "用户提现",
				router: "/customer/withdraw",
				type: 1,
				viewPath: "views/customer/withdraw/index.vue"
			},
			{
				icon: "icon-workbench",
				name: "账号注销",
				router: "/customer/writeoff",
				type: 1,
				viewPath: "views/customer/writeoff/index.vue"
			}
		]
	},
	// {
	// 	// 菜单图标
	// 	icon: "icon-workbench",
	// 	// 菜单名称
	// 	name: "系统管理",
	// 	// 菜单路由
	// 	router: "/sys",
	// 	// 菜单类型，0：目录，1：菜单，2：权限
	// 	type: 0,
	// 	// 子菜单
	// 	children: [
	// 		{
	// 			icon: "icon-auth",
	// 			name: "权限管理",
	// 			type: 0,
	// 			children: [
	// 				{
	// 					icon: "icon-workbench",
	// 					name: "菜单列表",
	// 					router: "/sys/menu",
	// 					type: 1,
	// 					viewPath: "cool/modules/base/views/menu.vue"
	// 				},
	// 				{
	// 					icon: "icon-user",
	// 					name: "用户列表",
	// 					router: "/sys/user",
	// 					type: 1,
	// 					viewPath: "cool/modules/base/views/user.vue"
	// 				},
	// 				{
	// 					icon: "icon-common",
	// 					name: "角色列表",
	// 					router: "/sys/role",
	// 					type: 1,
	// 					viewPath: "cool/modules/base/views/role.vue"
	// 				}
	// 			]
	// 		},
	// 		{
	// 			icon: "icon-common",
	// 			name: "参数配置",
	// 			type: 0,
	// 			children: [
	// 				{
	// 					icon: "icon-menu",
	// 					name: "参数列表",
	// 					router: "/sys/param",
	// 					type: 1,
	// 					viewPath: "cool/modules/base/views/param.vue"
	// 				}
	// 			]
	// 		},
	// 		{
	// 			icon: "icon-rank",
	// 			name: "监控管理",
	// 			type: 0,
	// 			children: [
	// 				{
	// 					icon: "icon-log",
	// 					name: "请求日志",
	// 					router: "/sys/log",
	// 					type: 1,
	// 					viewPath: "cool/modules/base/views/log.vue"
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	{
		icon: "icon-task",
		name: "demo",
		router: "/demo",
		type: 0,
		children: [
			{
				icon: "icon-workbench",
				name: "demo1",
				router: "/demo/doc",
				type: 1,
				viewPath: "views/demo/views/crud.vue"
			},
			{
				icon: "icon-workbench",
				name: "demo2",
				router: "/demo/doc2",
				type: 1,
				viewPath: "views/demo/views/demo.vue"
			}
		]
	},
	{
		icon: "icon-task",
		name: "框架教程",
		router: "/tutorial",
		type: 0,
		children: [
			{
				icon: "icon-workbench",
				name: "文档",
				router: "/tutorial/doc",
				type: 1,
				viewPath: "https://admin.cool-js.com"
			}
		]
	}
];
