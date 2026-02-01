import { instance } from '@/api/instance'
import type { InitPaymentRequest } from '@/api/types'

export const initPayment = async (data: InitPaymentRequest) =>
	await instance.post(`/payment/init`, data).then(res => res.data)
