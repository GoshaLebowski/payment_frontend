import { useEffect, useState } from 'react'
import { getAccessToken } from '@/api/cookies'

export function useAuth() {
	const [isAuth, setIsAuth] = useState(false)

	useEffect(() => {
		const token = getAccessToken()

		setIsAuth(Boolean(token && typeof token !== 'undefined'))
	}, [])

	return { isAuth }
}