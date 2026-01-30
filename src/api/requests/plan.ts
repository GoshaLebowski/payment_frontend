import { api } from '@/api/instance'
import { PlanResponse } from '@/api/types'

export const getAllPlans = async () =>
	await api.get<PlanResponse[]>('/plans').then(res => res.data)