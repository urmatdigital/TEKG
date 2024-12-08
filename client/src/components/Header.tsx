import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                TULPAR EXPRESS
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link 
              href="/track" 
              className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Отследить посылку
            </Link>
            <Link 
              href="/auth"
              className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Войти
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 