import { api } from '../instance'
import type { RegisterFormValues } from '@/components/auth/register-form'
import type { LoginFormValues } from '@/components/auth/login-form'

export const register = async (data: RegisterFormValues) =>
	await api.post('/auth/register', data).then(res => res.data)

export const login = async (data: LoginFormValues) =>
	await api.post('/auth/login', data).then(res => res.data)