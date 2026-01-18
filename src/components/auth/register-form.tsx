import { AuthWrapper } from '@/components/auth/auth-wrapper'

export function RegisterForm() {
	return (
		<AuthWrapper
			title={`Регистрация`}
			description={`Заполните форму ниже, чтобы создать аккаунт`}
			bottomText={`Уже есть аккаунте ?`}
			bottomTextLink={`Войти`}
			bottomLinkHref={`/auth/login`}
		>
			Content
		</AuthWrapper>
	)
}