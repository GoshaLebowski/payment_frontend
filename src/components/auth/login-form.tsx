'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useLoginMutation } from '@/api/hooks/useLoginMutation'

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
	email: z.email({ message: 'Введите корректный адрес электронной почты' }),
	password: z
		.string()
		.min(6, { message: 'Пароль должен содержать хотя бы 6 символов' })
		.max(128, { message: 'Пароль должен содержать не более 128 символов' })
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
	const router = useRouter()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const { mutate, isPending } = useLoginMutation({
		onSuccess() {
			router.push('/dashboard')
		},
		onError(error: any) {
			if (error.response?.data?.message) {
				setErrorMessage(error.response.data.message)
			} else if (error.message) {
				setErrorMessage(error.message)
			} else {
				setErrorMessage('Произошла неизвестная ошибка')
			}
		}
	})

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = (values: LoginFormValues) => {
		setErrorMessage(null)
		mutate(values)
	}

	return (
		<AuthWrapper
			title={`Авторизация`}
			description={`Заполните форму ниже, чтобы войти в аккаунт`}
			bottomText={`Ещё нет аккаунта?`}
			bottomTextLink={`Создать аккаунт`}
			bottomLinkHref={`/auth/register`}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={'space-y-4'}
				>
					{errorMessage && (
						<div
							className={`mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200`}
						>
							{errorMessage}
						</div>
					)}

					<FormField
						name='email'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Почта</FormLabel>
								<FormControl>
									<Input
										type={'email'}
										placeholder={`payment@payment.com`}
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name='password'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Пароль</FormLabel>
								<FormControl>
									<Input
										type={'password'}
										placeholder={`******`}
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type={'submit'}
						size={`lg`}
						className={'w-full'}
						disabled={isPending}
					>
						{isPending ? 'Выполняется вход...' : 'Продолжить'}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
