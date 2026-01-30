'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useRegisterMutation } from '@/api/hooks'

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

const registerSchema = z.object({
	name: z.string().min(1, { message: 'Имя обязательно' }),
	email: z.email({ message: 'Введите корректный адрес электронной почты' }),
	password: z
		.string()
		.min(6, { message: 'Пароль должен содержать хотя бы 6 символов' })
		.max(128, { message: 'Пароль должен содержать не более 128 символов' })
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
	const router = useRouter()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const { mutate, isPending } = useRegisterMutation({
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

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const onSubmit = (values: RegisterFormValues) => {
		mutate(values)
	}

	return (
		<AuthWrapper
			title={`Регистрация`}
			description={`Заполните форму ниже, чтобы создать аккаунт`}
			bottomText={`Уже есть аккаунте ?`}
			bottomTextLink={`Войти`}
			bottomLinkHref={`/auth/login`}
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
						name='name'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя</FormLabel>
								<FormControl>
									<Input
										placeholder={`Джон Майрс`}
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
						Продолжить
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
