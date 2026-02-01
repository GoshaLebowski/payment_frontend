'use client'

import { CheckIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useGetMeQuery } from '@/api/hooks'
import {
	InitPaymentRequestBillingPeriod,
	PlanResponse,
	SubscriptionResponseStatus
} from '@/api/types'

import { PaymentModal } from '@/components/home/payment-modal'
import { LayoutIconOne } from '@/components/icons/layout-icon-one'
import { LayoutIconThree } from '@/components/icons/layout-icon-three'
import { LayoutIconTwo } from '@/components/icons/layout-icon-two'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

import { cn } from '@/lib/utils'

import { useAuth } from '@/hooks'

interface PricingSectionProps {
	plans: PlanResponse[]
}

const size = 'size-9'

const icons = [
	{
		name: 'Базовый',
		component: <LayoutIconOne className={size} />
	},
	{
		name: 'Профессиональный',
		component: <LayoutIconTwo className={size} />
	},
	{
		name: 'Бизнес',
		component: <LayoutIconThree className={size} />
	}
]

export function PricingSection({ plans }: PricingSectionProps) {
	const router = useRouter()

	const [isYearly, setIsYearly] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState<PlanResponse | null>(null)
	const [pendingPlan, setPendingPlan] = useState<PlanResponse | null>(null)

	const [isPaymentOpen, setIsPaymentOpen] = useState(false)
	const [isConfirmReplaceOpen, setIsConfirmReplaceOpen] = useState(false)

	const { isAuth } = useAuth()
	const { data: user, isLoading } = useGetMeQuery()

	const hasActiveSubscription =
		isAuth &&
		!isLoading &&
		user?.subscription &&
		user.subscription.status === SubscriptionResponseStatus.ACTIVE

	const isSamePlan = (planId: string) =>
		user?.subscription?.plan.id === planId

	const handleGetStarted = (plan: PlanResponse) => {
		if (!isAuth) return router.push('/auth/login')

		if (hasActiveSubscription && !isSamePlan(plan.id)) {
			setPendingPlan(plan)
			setIsConfirmReplaceOpen(true)

			return
		}

		setSelectedPlan(plan)
		setIsPaymentOpen(true)
	}

	const confirmPlanReplace = () => {
		if (!pendingPlan) return

		setSelectedPlan(pendingPlan)

		setIsPaymentOpen(true)
		setIsConfirmReplaceOpen(false)
	}

	const calculateYearlyDiscount = (
		monthlyPrice: number,
		yearlyPrice: number
	) => {
		const yearlyMonthly = yearlyPrice / 12

		const discount = ((monthlyPrice - yearlyMonthly) / monthlyPrice) * 100

		return Math.round(discount)
	}

	return (
		<>
			<section className={`px-6 pb-20`}>
				<div className={`mx-auto max-w-7xl`}>
					<div className={`mb-12 flex justify-center`}>
						<div className={`flex flex-col items-center gap-4`}>
							<div
								className={`flex items-center gap-3 px-4 py-2`}
							>
								<span
									className={cn(
										'text-sm font-medium transition-colors',
										isYearly
											? 'text-gray-500'
											: 'text-gray-900'
									)}
								>
									Месячно
								</span>

								<Switch
									checked={isYearly}
									onCheckedChange={setIsYearly}
								/>

								<span
									className={cn(
										'text-sm font-medium transition-colors',
										isYearly
											? 'text-gray-900'
											: 'text-gray-500'
									)}
								>
									Годовая
								</span>
							</div>

							{isYearly && (
								<div
									className={`rounded-lg bg-orange-500 px-3 py-1 text-xs font-medium text-white`}
								>
									Экономия 20%
								</div>
							)}
						</div>
					</div>

					<div className={`grid gap-8 md:grid-cols-3`}>
						{plans.map((plan, index) => {
							const icon = icons.find(
								icon => icon.name === plan.title
							)
							const displayPrice = isYearly
								? Math.round(plan.yearlyPrice / 12)
								: plan.monthlyPrice

							const isCurrentPlan = isSamePlan(plan.id)

							const buttonText = !isAuth
								? 'Выбрать тариф'
								: isLoading
									? 'Загрузка...'
									: hasActiveSubscription && isCurrentPlan
										? 'Продлить подписку'
										: hasActiveSubscription &&
											  !isCurrentPlan
											? 'Переключиться'
											: 'Выбрать тариф'

							return (
								<Card
									key={index}
									className={cn(
										`relative rounded-3xl border-0 bg-white/95 p-8 shadow-lg backdrop-blur-sm`,
										plan.isFeatured &&
											'transform shadow-xl ring-2 ring-orange-500 ring-offset-2'
									)}
								>
									<div
										className={`flex size-12 items-center justify-center rounded-2xl border-2 border-orange-600 bg-orange-500 text-2xl shadow-md`}
									>
										{icon?.component || (
											<LayoutIconOne className={size} />
										)}
									</div>

									<div>
										<h3
											className={`mb-2 text-2xl font-bold text-gray-900`}
										>
											{plan.title}
										</h3>

										<p className={`text-sm text-green-600`}>
											{plan.description}
										</p>
									</div>

									<div className={`flex items-center gap-1`}>
										<span
											className={`text-3xl font-bold text-gray-900`}
										>
											{displayPrice} &#8381;
										</span>
										<span className={`text-gray-500`}>
											/ в месяц
										</span>
									</div>

									<div>
										{isYearly ? (
											<div
												className={
													'text-base text-gray-500'
												}
											>
												{plan.yearlyPrice} &#8381; в год
											</div>
										) : (
											<div
												className={
													'text-base text-gray-500'
												}
											>
												Останавливайте и отменяйте
												подписку в любой момент
											</div>
										)}

										{isYearly && (
											<div>
												Оплата за весь год, экономия{' '}
												{calculateYearlyDiscount(
													plan.monthlyPrice,
													plan.yearlyPrice
												)}{' '}
												%
											</div>
										)}
									</div>

									<Button
										onClick={() => handleGetStarted(plan)}
										size={'lg'}
										className={`w-full`}
									>
										{buttonText}
									</Button>

									<div className={`space-y-4`}>
										<h4
											className={`mb-4 font-semibold text-gray-900`}
										>
											В тариф входят:
										</h4>

										{plan.features.map((feature, index) => (
											<div
												key={index}
												className={`flex items-start gap-3`}
											>
												<div
													className={`flex size-5 items-center justify-center rounded-full bg-orange-500`}
												>
													<CheckIcon
														className={`text-white`}
														size={14}
													/>
												</div>
												<span
													className={`text-sm text-gray-700`}
												>
													{feature}
												</span>
											</div>
										))}
									</div>
								</Card>
							)
						})}
					</div>
				</div>
			</section>

			{selectedPlan && (
				<PaymentModal
					isOpen={isPaymentOpen}
					onClose={() => setIsPaymentOpen(false)}
					plan={selectedPlan}
					price={
						isYearly
							? selectedPlan?.yearlyPrice
							: selectedPlan?.monthlyPrice
					}
					billingPeriod={
						isYearly
							? InitPaymentRequestBillingPeriod.YEARLY
							: InitPaymentRequestBillingPeriod.MONTHLY
					}
				/>
			)}

			{
				<AlertDialog
					open={isConfirmReplaceOpen}
					onOpenChange={setIsConfirmReplaceOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Смена тарифа</AlertDialogTitle>
							<AlertDialogDescription>
								У вас уже активна на тариф{' '}
								<b>{user?.subscription?.plan?.title}</b>, до{' '}
								{new Date(
									user?.subscription?.endDate || ''
								).toLocaleDateString()}
								. Если вы выберите другой план, остаток текущей
								подписки сгорит
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Отмена</AlertDialogCancel>
							<AlertDialogAction onClick={confirmPlanReplace}>
								Продолжить
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			}
		</>
	)
}
