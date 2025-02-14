import { call } from 'frappe-ui'
import { reactive, ref } from 'vue'

export const isLoggedIn = ref(localStorage.getItem('isLoggedIn') !== null)
export const user = reactive({
	full_name: '',
	user_image: '',
})

document.cookie
	.split('; ')
	.map((c) => c.split('='))
	.forEach(([key, value]) => {
		user[key] = decodeURIComponent(value)
		if (key === 'user_id') {
			isLoggedIn.value = value !== 'Guest'
			localStorage.setItem('isLoggedIn', value !== 'Guest')
		}
	})

export async function login(email, password) {
	resetAuth()
	let res = await call('login', {
		usr: email,
		pwd: password,
	})
	if (res) {
		localStorage.setItem('isLoggedIn', true)
		user.full_name = res.full_name
		user.user_image = res.user_image
		isLoggedIn.value = true
	}
	return isLoggedIn.value
}
export async function logout() {
	resetAuth()
	await call('logout')
	window.location.reload()
}

export function resetAuth() {
	localStorage.removeItem('isLoggedIn')
	isLoggedIn.value = false
}
