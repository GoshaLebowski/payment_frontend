'use client'

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLoginMutation } from '@/api/hooks/useLoginMutation'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
	email: z.email({ message: 'Введите корректный адрес электронной почты' }),
	password: z.string()
		.min(6, { message: 'Пароль должен содержать хотя бы 6 символов' })
		.max(128, { message: 'Пароль должен содержать не более 128 символов' })
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
	const router = useRouter()

	const { mutate, isPending } = useLoginMutation({
		onSuccess() {
			router.push('/dashboard')
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
					<FormField
						name="email"
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
						name="password"
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