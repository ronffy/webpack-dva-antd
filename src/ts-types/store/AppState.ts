/**
 * @description: 全局 state
 * @author: zs
 * @Date: 2020-06-13 20:23:38
 * @LastEditTime: 2020-06-13 20:38:36
 * @LastEditors: zs
 */
export type MenuItem = {
	id: number
	icon?: string
	name: string
	component: string
	pid?: number
}

export type User = {
	id: number
	username: string
	nickname: string
	deptId: number
	[props: string]: any
}

type AppState = {
	// user: Partial<User>
	// menu: MenuItem[]
	// defaultMenu: Partial<MenuItem>
	// menuPopoverVisible: boolean
	// siderFold: boolean
	// darkTheme: boolean
	// isNavbar: boolean
	// navOpenKeys: string[]
	// defaultOpenKeys: string[]
	// locationPathname: string
	// webSocketUrl: string
	// locationQuery: {
	// 	[props: string]: any
	// }
}

export default AppState