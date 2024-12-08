import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">О компании</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">О нас</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Вакансии</Link></li>
              <li><Link href="/news" className="text-muted-foreground hover:text-foreground">Новости</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li><Link href="/services/delivery" className="text-muted-foreground hover:text-foreground">Доставка</Link></li>
              <li><Link href="/services/tracking" className="text-muted-foreground hover:text-foreground">Отслеживан��е</Link></li>
              <li><Link href="/services/calculator" className="text-muted-foreground hover:text-foreground">Калькулятор</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground">Помощь</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>ул. Примерная, 123</li>
              <li>г. Бишкек, Кыргызстан</li>
              <li>+996 XXX XXX XXX</li>
              <li>info@te.kg</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tulpar Express. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
} 