import { Truck, Package, Clock, Shield } from 'lucide-react'

const features = [
  {
    name: 'Быстрая доставка',
    description: 'Доставляем посылки в кратчайшие сроки по всему Кыргызстану',
    icon: Truck,
  },
  {
    name: 'Надежная упаковка',
    description: 'Гарантируем сохранность ваших отправлений',
    icon: Package,
  },
  {
    name: 'Отслеживание',
    description: 'Следите за статусом доставки в режиме реального времени',
    icon: Clock,
  },
  {
    name: 'Безопасность',
    description: 'Ваши отправления застрахованы',
    icon: Shield,
  },
]

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Преимущества</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Почему выбирают нас
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Мы предоставляем качественные услуги доставки, которым доверяют тысячи клиентов
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 