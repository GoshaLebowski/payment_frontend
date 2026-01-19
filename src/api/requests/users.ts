import { instance } from '../instance'
import { GetMeResponse } from '@/api/types'

export const getMe = async () =>
	await instance.get<GetMeResponse>('/users/@me').then(res => res.data)