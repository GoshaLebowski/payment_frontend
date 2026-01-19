import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { register } from '@/api/requests'
import type { AuthResponse, RegisterRequest } from '../types'

export function useRegisterMutation(
	options?: Omit<UseMutationOptions<AuthResponse, unknown, RegisterRequest>, 'mutationKey' | 'mutationFn'>
) {
	return useMutation({
		mutationKey: ['register'],
		mutationFn: (data: RegisterRequest) => register(data),
		...options
	})
}